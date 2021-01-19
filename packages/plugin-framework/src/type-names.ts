import {AnyDescriptorProto, AnyTypeDescriptorProto, isAnyTypeDescriptorProto} from "./descriptor-info";
import {DescriptorParentFn, IDescriptorTree} from "./descriptor-tree";
import {FileDescriptorProto} from "./google/protobuf/descriptor";
import {assert} from "@protobuf-ts/runtime";

/**
 * Can lookup a type name.
 *
 * Type names are normalized, the leading period generated by
 * protoc is removed.
 */
export interface ITypeNameLookup {

    /**
     * Removes leading period from name.
     */
    normalizeTypeName(typeName: string): string;

    /**
     * Return the descriptor for the given type name.
     *
     * Throws if not found.
     */
    resolveTypeName(typeName: string): AnyTypeDescriptorProto;

    /**
     * Return the descriptor for the given type name - or `undefined`.
     */
    peekTypeName(typeName: string): AnyTypeDescriptorProto | undefined;

    /**
     * Get the type name for the given descriptor.
     */
    makeTypeName(descriptor: AnyTypeDescriptorProto): string;

}

export class TypeNameLookup implements ITypeNameLookup {


    /**
     * Create the lookup from a list of descriptors and a function
     * that provides the parent of a descriptor.
     */
    static from(descriptors: AnyDescriptorProto[], parentProvider: DescriptorParentFn): TypeNameLookup;

    /**
     * Create the lookup from an existing tree.
     */
    static from(tree: IDescriptorTree): TypeNameLookup;

    static from(a: AnyDescriptorProto[] | IDescriptorTree, b?: DescriptorParentFn): TypeNameLookup {
        let data: Array<{ descriptor: AnyTypeDescriptorProto, ancestors: AnyDescriptorProto[] }> = [];
        if (Array.isArray(a) && b) {
            for (let descriptor of a) {
                if (!isAnyTypeDescriptorProto(descriptor)) {
                    continue;
                }
                let ancestors = [];
                let p = b(descriptor);
                while (p) {
                    ancestors.unshift(p);
                    p = b(descriptor);
                }
                data.push({descriptor, ancestors});
            }
        } else if (!Array.isArray(a) && !b) {
            a.visitTypes(descriptor => {
                data.push({descriptor, ancestors: a.ancestorsOf(descriptor)});
            });
        } else {
            assert(false);
        }
        return new TypeNameLookup(data);
    }


    private readonly _names: ReadonlyMap<string, AnyTypeDescriptorProto>;
    private readonly _reverse: ReadonlyMap<AnyTypeDescriptorProto, string>;

    constructor(data: Array<{ descriptor: AnyTypeDescriptorProto, ancestors: AnyDescriptorProto[] }>) {
        const names = new Map<string, AnyTypeDescriptorProto>();
        const reverse = new Map<AnyTypeDescriptorProto, string>();
        for (let {descriptor, ancestors} of data) {
            let name = composeTypeName([...ancestors, descriptor]);
            assert(!names.has(name));
            names.set(name, descriptor);
            reverse.set(descriptor, name);
        }
        this._names = names;
        this._reverse = reverse;
    }

    normalizeTypeName(typeName: string): string {
        return typeName.startsWith(".") ? typeName.substring(1) : typeName;
    }

    resolveTypeName(typeName: string): AnyTypeDescriptorProto {
        typeName = this.normalizeTypeName(typeName);
        const d = this._names.get(typeName);
        assert(d !== undefined, `Unable to resolve type name "${typeName}"`);
        return d;
    }

    peekTypeName(typeName: string): AnyTypeDescriptorProto | undefined {
        typeName = this.normalizeTypeName(typeName);
        return this._names.get(typeName);
    }

    makeTypeName(descriptor: AnyTypeDescriptorProto): string {
        const n = this._reverse.get(descriptor)
        assert(n !== undefined);
        return n;
    }

}


/**
 * Compose a fully qualified type name for enum,
 * message or service.
 *
 * Example:
 *   my_package.MyMessage.MyNestedMessage
 *
 * Throws if given array is invalid.
 */
function composeTypeName(descriptors: readonly AnyDescriptorProto[]): string {
    assert(descriptors.length > 0);
    const
        parts = [],
        mid = descriptors.concat(),
        first = mid.shift(),
        last = mid.pop();
    assert(FileDescriptorProto.is(first));
    assert(isAnyTypeDescriptorProto(last), "expected any type descriptor, got: " + typeof (last));
    const pkg = first.package;
    if (pkg !== undefined && pkg !== '') {
        parts.push(pkg);
    }
    for (const item of [...mid, last]) {
        let part = item.name;
        assert(part !== undefined);
        parts.push(part);
    }
    return parts.join('.');
}

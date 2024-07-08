// @generated by protobuf-ts 2.9.4 with parameter long_type_bigint,optimize_code_size,generate_dependencies
// @generated from protobuf file "google/protobuf/duration.proto" (package "google.protobuf", syntax proto3)
// tslint:disable
//
// Protocol Buffers - Google's data interchange format
// Copyright 2008 Google Inc.  All rights reserved.
// https://developers.google.com/protocol-buffers/
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//     * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
import { typeofJsonValue } from "@protobuf-ts/runtime";
import type { JsonValue } from "@protobuf-ts/runtime";
import type { JsonReadOptions } from "@protobuf-ts/runtime";
import type { JsonWriteOptions } from "@protobuf-ts/runtime";
import { PbLong } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * A Duration represents a signed, fixed-length span of time represented
 * as a count of seconds and fractions of seconds at nanosecond
 * resolution. It is independent of any calendar and concepts like "day"
 * or "month". It is related to Timestamp in that the difference between
 * two Timestamp values is a Duration and it can be added or subtracted
 * from a Timestamp. Range is approximately +-10,000 years.
 *
 * # Examples
 *
 * Example 1: Compute Duration from two Timestamps in pseudo code.
 *
 *     Timestamp start = ...;
 *     Timestamp end = ...;
 *     Duration duration = ...;
 *
 *     duration.seconds = end.seconds - start.seconds;
 *     duration.nanos = end.nanos - start.nanos;
 *
 *     if (duration.seconds < 0 && duration.nanos > 0) {
 *       duration.seconds += 1;
 *       duration.nanos -= 1000000000;
 *     } else if (duration.seconds > 0 && duration.nanos < 0) {
 *       duration.seconds -= 1;
 *       duration.nanos += 1000000000;
 *     }
 *
 * Example 2: Compute Timestamp from Timestamp + Duration in pseudo code.
 *
 *     Timestamp start = ...;
 *     Duration duration = ...;
 *     Timestamp end = ...;
 *
 *     end.seconds = start.seconds + duration.seconds;
 *     end.nanos = start.nanos + duration.nanos;
 *
 *     if (end.nanos < 0) {
 *       end.seconds -= 1;
 *       end.nanos += 1000000000;
 *     } else if (end.nanos >= 1000000000) {
 *       end.seconds += 1;
 *       end.nanos -= 1000000000;
 *     }
 *
 * Example 3: Compute Duration from datetime.timedelta in Python.
 *
 *     td = datetime.timedelta(days=3, minutes=10)
 *     duration = Duration()
 *     duration.FromTimedelta(td)
 *
 * # JSON Mapping
 *
 * In JSON format, the Duration type is encoded as a string rather than an
 * object, where the string ends in the suffix "s" (indicating seconds) and
 * is preceded by the number of seconds, with nanoseconds expressed as
 * fractional seconds. For example, 3 seconds with 0 nanoseconds should be
 * encoded in JSON format as "3s", while 3 seconds and 1 nanosecond should
 * be expressed in JSON format as "3.000000001s", and 3 seconds and 1
 * microsecond should be expressed in JSON format as "3.000001s".
 *
 *
 * @generated from protobuf message google.protobuf.Duration
 */
export interface Duration {
    /**
     * Signed seconds of the span of time. Must be from -315,576,000,000
     * to +315,576,000,000 inclusive. Note: these bounds are computed from:
     * 60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years
     *
     * @generated from protobuf field: int64 seconds = 1;
     */
    seconds: bigint;
    /**
     * Signed fractions of a second at nanosecond resolution of the span
     * of time. Durations less than one second are represented with a 0
     * `seconds` field and a positive or negative `nanos` field. For durations
     * of one second or more, a non-zero value for the `nanos` field must be
     * of the same sign as the `seconds` field. Must be from -999,999,999
     * to +999,999,999 inclusive.
     *
     * @generated from protobuf field: int32 nanos = 2;
     */
    nanos: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class Duration$Type extends MessageType<Duration> {
    constructor() {
        super("google.protobuf.Duration", [
            { no: 1, name: "seconds", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 2, name: "nanos", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    /**
     * Encode `Duration` to JSON string like "3.000001s".
     */
    internalJsonWrite(message: Duration, options: JsonWriteOptions): JsonValue {
        let s = PbLong.from(message.seconds).toNumber();
        if (s > 315576000000 || s < -315576000000)
            throw new Error("Duration value out of range.");
        let text = message.seconds.toString();
        if (s === 0 && message.nanos < 0)
            text = "-" + text;
        if (message.nanos !== 0) {
            let nanosStr = Math.abs(message.nanos).toString();
            nanosStr = "0".repeat(9 - nanosStr.length) + nanosStr;
            if (nanosStr.substring(3) === "000000")
                nanosStr = nanosStr.substring(0, 3);
            else if (nanosStr.substring(6) === "000")
                nanosStr = nanosStr.substring(0, 6);
            text += "." + nanosStr;
        }
        return text + "s";
    }
    /**
     * Decode `Duration` from JSON string like "3.000001s"
     */
    internalJsonRead(json: JsonValue, options: JsonReadOptions, target?: Duration): Duration {
        if (typeof json !== "string")
            throw new Error("Unable to parse Duration from JSON " + typeofJsonValue(json) + ". Expected string.");
        let match = json.match(/^(-?)([0-9]+)(?:\.([0-9]+))?s/);
        if (match === null)
            throw new Error("Unable to parse Duration from JSON string. Invalid format.");
        if (!target)
            target = this.create();
        let [, sign, secs, nanos] = match;
        let longSeconds = PbLong.from(sign + secs);
        if (longSeconds.toNumber() > 315576000000 || longSeconds.toNumber() < -315576000000)
            throw new Error("Unable to parse Duration from JSON string. Value out of range.");
        target.seconds = longSeconds.toBigInt();
        if (typeof nanos == "string") {
            let nanosStr = sign + nanos + "0".repeat(9 - nanos.length);
            target.nanos = parseInt(nanosStr);
        }
        return target;
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.Duration
 */
export const Duration = new Duration$Type();

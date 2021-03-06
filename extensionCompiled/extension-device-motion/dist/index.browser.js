var jsPsychExtensionDeviceMotion = (function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    class DeviceMotionExtension {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
            this.initialize = () => __awaiter(this, void 0, void 0, function* () {
                this.domObserver = new MutationObserver(this.mutationObserverCallback);
            });
            this.on_start = (params) => {
                params = params || {};
                this.currentTrialData = [];
                this.currentTrialTargets = new Map();
                this.currentTrialSelectors = params.targets || [];
                this.lastSampleTime = null;
                this.eventsToTrack = params.events || ["devicemotion"];
                this.domObserver.observe(this.jsPsych.getDisplayElement(), { childList: true });
            };
            this.on_load = () => {
                // set current trial start time
                this.currentTrialStartTime = performance.now();
                // start data collection
                if (this.eventsToTrack.includes("devicemotion")) {
                    window.addEventListener("devicemotion", this.deviceMotionEventHandler, true);
                }
            };
            this.on_finish = () => {
                this.domObserver.disconnect();
                if (this.eventsToTrack.includes("devicemotion")) {
                    window.removeEventListener("devicemotion", this.deviceMotionEventHandler, true);
                }
                return {
                    device_motion_data: this.currentTrialData,
                };
            };
            this.deviceMotionEventHandler = (eventA) => {
                const event_time = performance.now();
                const t = Math.round(event_time - this.currentTrialStartTime);
                var x = eventA.acceleration.x;
                var y = eventA.acceleration.y;
                var z = eventA.acceleration.z;
                var interval = eventA.interval; //gets interval between samples in ms
                this.lastSampleTime = event_time;
                this.currentTrialData.push({ x, y, z, interval, t, event: "devicemotion" });
            };
            this.mutationObserverCallback = (mutationsList, observer) => {
                for (const selector of this.currentTrialSelectors) {
                    if (!this.currentTrialTargets.has(selector)) {
                        const target = this.jsPsych.getDisplayElement().querySelector(selector);
                        if (target) {
                            this.currentTrialTargets.set(selector, target.getBoundingClientRect());
                        }
                    }
                }
            };
        }
    }
    DeviceMotionExtension.info = {
        name: "device-motion-tracking",
    };

    return DeviceMotionExtension;

})();
//# sourceMappingURL=index.browser.js.map

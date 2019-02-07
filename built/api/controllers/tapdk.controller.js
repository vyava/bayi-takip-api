"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tapdk_1 = require("../helper/tapdk");
const task_controller_1 = require("./task.controller");
const bayi_controller_1 = require("./bayi.controller");
/**
 * Get distributor
 * @public
 */
function getSource(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { params, taskId } = req.body;
            let bayiler = yield tapdk_1.getSourceFromExternal(params);
            let _task = yield task_controller_1.findTaskById(taskId)
                .then(_task => {
                return task_controller_1.taskBlock(_task);
            })
                .catch(() => {
                throw new Error(`Task bloke edilemedi ${_task.active}`);
            });
            let result = yield bayi_controller_1.updateBayiler(bayiler)
                .then((_result) => {
                task_controller_1.taskDone(_task);
                return _result;
            })
                .catch(() => {
                task_controller_1.taskError(_task);
                throw new Error(`Task bloke edilemedi ${_task.active}`);
            });
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    });
}
;
module.exports = getSource;

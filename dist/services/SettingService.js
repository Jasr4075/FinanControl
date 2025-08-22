"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingService = void 0;
const Setting_1 = require("../models/Setting");
class SettingService {
    static createSetting(userId, chave, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !chave || !value) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
            const existingSetting = yield Setting_1.Setting.findOne({ where: { userId, chave } });
            if (existingSetting) {
                throw new Error('Setting já existe para esse usuário e chave.');
            }
            return yield Setting_1.Setting.create({ userId, chave, value });
        });
    }
    static getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Setting_1.Setting.findAll();
        });
    }
    static getSettingById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = yield Setting_1.Setting.findByPk(id);
            if (!setting) {
                throw new Error('Setting não encontrada.');
            }
            return setting;
        });
    }
    static updateSetting(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = yield Setting_1.Setting.findByPk(id);
            if (!setting) {
                throw new Error('Setting não encontrada.');
            }
            return yield setting.update(data);
        });
    }
    static deleteSetting(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = yield Setting_1.Setting.findByPk(id);
            if (!setting) {
                throw new Error('Setting não encontrada.');
            }
            yield setting.destroy();
            return { message: 'Setting excluída com sucesso.' };
        });
    }
}
exports.SettingService = SettingService;

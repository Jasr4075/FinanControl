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
exports.deleteSetting = exports.updateSetting = exports.getSettingById = exports.getSettings = exports.createSetting = void 0;
const SettingService_1 = require("../services/SettingService");
const createSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, chave, value } = req.body;
        const setting = yield SettingService_1.SettingService.createSetting(userId, chave, value);
        res.status(201).json(setting);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createSetting = createSetting;
const getSettings = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield SettingService_1.SettingService.getSettings();
        res.status(200).json(settings);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getSettings = getSettings;
const getSettingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const setting = yield SettingService_1.SettingService.getSettingById(req.params.id);
        res.status(200).json(setting);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.getSettingById = getSettingById;
const updateSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const setting = yield SettingService_1.SettingService.updateSetting(req.params.id, req.body);
        res.status(200).json(setting);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateSetting = updateSetting;
const deleteSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield SettingService_1.SettingService.deleteSetting(req.params.id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.deleteSetting = deleteSetting;

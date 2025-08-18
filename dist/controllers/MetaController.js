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
exports.deleteMeta = exports.updateMeta = exports.getMetaById = exports.getMetas = exports.createMeta = void 0;
const MetaService_1 = require("../services/MetaService");
const meta_schema_1 = require("../validators/meta.schema");
const createMeta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const metaValidated = meta_schema_1.metaCreateSchema.parse(req.body);
        const meta = yield MetaService_1.MetaService.create(metaValidated);
        res.status(201).json({ success: true, data: meta });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createMeta = createMeta;
const getMetas = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const metas = yield MetaService_1.MetaService.getAll();
        res.status(200).json({ success: true, data: metas });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getMetas = getMetas;
const getMetaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const meta = yield MetaService_1.MetaService.getById(id);
        res.status(200).json({ success: true, data: meta });
    }
    catch (error) {
        res.status(error.message === 'Meta não encontrada.' ? 404 : 500).json({ success: false, message: error.message });
    }
});
exports.getMetaById = getMetaById;
const updateMeta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const metaValidated = meta_schema_1.metaUpdateSchema.parse(req.body);
        const metaAtualizada = yield MetaService_1.MetaService.update(id, metaValidated);
        res.status(200).json({ success: true, data: metaAtualizada });
    }
    catch (error) {
        const status = error.message === 'Meta não encontrada.' ? 404 : 400;
        res.status(status).json({ success: false, message: error.message });
    }
});
exports.updateMeta = updateMeta;
const deleteMeta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const resultado = yield MetaService_1.MetaService.delete(id);
        res.status(200).json({ success: true, message: resultado.message });
    }
    catch (error) {
        res.status(error.message === 'Meta não encontrada.' ? 404 : 500).json({ success: false, message: error.message });
    }
});
exports.deleteMeta = deleteMeta;

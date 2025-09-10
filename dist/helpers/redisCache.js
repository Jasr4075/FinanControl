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
exports.getUserCached = getUserCached;
const redisClient_1 = require("../redisClient");
const UsuarioService_1 = require("../services/UsuarioService");
function getUserCached(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = `user:${username}`;
        const cached = yield redisClient_1.redisClient.get(key);
        if (cached)
            return JSON.parse(cached);
        const user = yield UsuarioService_1.UsuarioService.findByUsernameRaw(username);
        if (user) {
            yield redisClient_1.redisClient.set(key, JSON.stringify(user), { EX: 300 }); // 5 minutos
        }
        return user;
    });
}

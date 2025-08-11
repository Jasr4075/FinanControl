import { Request, Response } from 'express'
import { SettingService } from '../services/SettingService'

export const createSetting = async (req: Request, res: Response) => {
  try {
    const { userId, chave, value } = req.body
    const setting = await SettingService.createSetting(userId, chave, value)
    res.status(201).json(setting)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const getSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await SettingService.getSettings()
    res.status(200).json(settings)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getSettingById = async (req: Request, res: Response) => {
  try {
    const setting = await SettingService.getSettingById(req.params.id)
    res.status(200).json(setting)
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}

export const updateSetting = async (req: Request, res: Response) => {
  try {
    const setting = await SettingService.updateSetting(req.params.id, req.body)
    res.status(200).json(setting)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteSetting = async (req: Request, res: Response) => {
  try {
    const result = await SettingService.deleteSetting(req.params.id)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}

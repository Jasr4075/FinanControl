// @ts-ignore → ignora a falta de tipagem
import { MercadoPagoConfig, Payment, Preference, Order, MerchantOrder } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

export const mercadoPago = {
  preference: new Preference(client),
  payment: new Payment(client),
  order: new Order(client),
  merchantOrder: new MerchantOrder(client),
}

export default mercadoPago

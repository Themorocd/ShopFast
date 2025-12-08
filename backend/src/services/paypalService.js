// src/services/paypalService.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID_SANDBOX;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET_SANDBOX;
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

// 👀 LOG de comprobación al arrancar el servidor
console.log('PAYPAL_CLIENT_ID_SANDBOX:', PAYPAL_CLIENT_ID ? PAYPAL_CLIENT_ID.slice(0, 10) + '...' : 'NO DEFINIDO');
console.log('PAYPAL_SECRET_SANDBOX definido:', !!PAYPAL_SECRET);
console.log('PAYPAL_API_BASE:', PAYPAL_API_BASE);

// Si falta algo, mejor petar aquí que en medio del pago
if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
  throw new Error('❌ Configuración de PayPal incompleta. Revisa PAYPAL_CLIENT_ID_SANDBOX y PAYPAL_SECRET_SANDBOX en .env');
}

// 1) Obtener token de acceso de PayPal
const getAccessToken = async () => {
  try {
    const response = await axios({
      url: `${PAYPAL_API_BASE}/v1/oauth2/token`,
      method: 'post',
      data: 'grant_type=client_credentials',
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_SECRET
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('❌ Error obteniendo access_token de PayPal:');
    console.error(error.response?.data || error.message);
    throw error;
  }
};

// 2) Crear una orden de PayPal
export const createPayPalOrder = async (total) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios({
      url: `${PAYPAL_API_BASE}/v2/checkout/orders`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      data: {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: total.toFixed(2) // total en string con 2 decimales
            }
          }
        ]
      }
    });

    return response.data; // aquí viene order.id
  } catch (error) {
    console.error('❌ Error creando orden PayPal:');
    console.error(error.response?.data || error.message);
    throw error;
  }
};

// 3) Capturar la orden (cuando el usuario “paga”)
export const capturePayPalOrder = async (orderId) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios({
      url: `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data; // aquí viene el capture id, estado, etc.
  } catch (error) {
    console.error('❌ Error capturando orden PayPal:');
    console.error(error.response?.data || error.message);
    throw error;
  }
};

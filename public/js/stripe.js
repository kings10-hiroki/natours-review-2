import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe('pk_test_51GxRllILYK9WUpFw5RT22vrkcGPYumgdFoO0IrW5MJ7XC82nEubGZzIYsw7X9xzPyqBvhmSPUUhbfgvizeqNF5fL00VE6rlhT3');

export const bookTour = async tourId => {
    try {
        const session = await axios({
            method: 'GET',
            url: `/api/v1/bookings/checkout-session/${tourId}`
        });

        await stripe.redirectToCheckout({ sessionId: session.data.session.id });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
}
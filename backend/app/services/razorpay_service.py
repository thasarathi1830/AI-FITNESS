"""
Razorpay payment service
"""
import razorpay
import hmac
import hashlib
from app.config import settings

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

def create_razorpay_order(amount: float, currency: str = "INR"):
    """
    Create a Razorpay order for payment.
    
    Args:
        amount: Amount in rupees
        currency: Currency code (default: INR)
        
    Returns:
        Razorpay order details
    """
    # Convert amount to paise (smallest currency unit)
    amount_in_paise = int(amount * 100)
    
    order_data = {
        "amount": amount_in_paise,
        "currency": currency,
        "payment_capture": 1  # Auto capture payment
    }
    
    order = razorpay_client.order.create(data=order_data)
    return order

def verify_payment_signature(order_id: str, payment_id: str, signature: str) -> bool:
    """
    Verify Razorpay payment signature.
    
    Args:
        order_id: Razorpay order ID
        payment_id: Razorpay payment ID
        signature: Payment signature from Razorpay
        
    Returns:
        True if signature is valid, False otherwise
    """
    try:
        # Generate signature
        message = f"{order_id}|{payment_id}"
        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(generated_signature, signature)
    except Exception:
        return False

def get_payment_details(payment_id: str):
    """
    Get payment details from Razorpay.
    
    Args:
        payment_id: Razorpay payment ID
        
    Returns:
        Payment details
    """
    return razorpay_client.payment.fetch(payment_id)

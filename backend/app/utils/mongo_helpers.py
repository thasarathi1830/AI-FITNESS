"""
MongoDB helper utilities for database operations
"""
from bson import ObjectId
from datetime import datetime
from typing import Optional, Dict, Any

def serialize_doc(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Serialize MongoDB document by converting ObjectId to string.
    
    Args:
        doc: MongoDB document
        
    Returns:
        Serialized document with _id as string
    """
    if doc is None:
        return None
    
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    
    return doc

def serialize_docs(docs: list) -> list:
    """
    Serialize list of MongoDB documents.
    
    Args:
        docs: List of MongoDB documents
        
    Returns:
        List of serialized documents
    """
    return [serialize_doc(doc) for doc in docs]

class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic models"""
    
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

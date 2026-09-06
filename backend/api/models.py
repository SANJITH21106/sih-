from __future__ import annotations
from fastapi import APIRouter

try:
    from backend.schemas.shared_schemas import ModelInfo, ModelsListResponse
except ImportError:
    from schemas.shared_schemas import ModelInfo, ModelsListResponse

router = APIRouter(tags=["models"])

STATIC_MODELS: list[ModelInfo] = [
    ModelInfo(
        model_id="general_model",
        model_name="llama3.1:8b",
        model_type="general",
        capabilities=["chat"],
        context_length=8192,
        quantization="Q4_K_M",
        memory_requirement="8GB",
        supported_tasks=["SIMPLE"],
        ollama_tag="llama3.1:8b",
        is_default_for_tasks=["SIMPLE"],
    ),
    ModelInfo(
        model_id="reasoning_model",
        model_name="llama3.1:8b-instruct",
        model_type="reasoning",
        capabilities=["multi-step reasoning", "tool use"],
        context_length=8192,
        quantization="Q4_K_M",
        memory_requirement="8GB",
        supported_tasks=["REASONING", "DOCUMENT"],
        ollama_tag="llama3.1:8b-instruct",
        is_default_for_tasks=["REASONING", "DOCUMENT"],
    ),
    ModelInfo(
        model_id="coding_model",
        model_name="qwen2.5-coder:7b",
        model_type="coding",
        capabilities=["code generation", "debugging"],
        context_length=32768,
        quantization="Q4_K_M",
        memory_requirement="8GB",
        supported_tasks=["CODING"],
        ollama_tag="qwen2.5-coder:7b",
        is_default_for_tasks=["CODING"],
    ),
    ModelInfo(
        model_id="vision_model",
        model_name="llava:7b",
        model_type="vision",
        capabilities=["image understanding"],
        context_length=4096,
        quantization="Q4_K_M",
        memory_requirement="8GB",
        supported_tasks=["MULTIMODAL"],
        ollama_tag="llava:7b",
        is_default_for_tasks=["MULTIMODAL"],
    ),
    ModelInfo(
        model_id="embedding_model",
        model_name="nomic-embed-text",
        model_type="embedding",
        capabilities=["text embedding"],
        context_length=2048,
        quantization="F16",
        memory_requirement="2GB",
        supported_tasks=["REASONING", "DOCUMENT"],
        ollama_tag="nomic-embed-text",
        is_default_for_tasks=[],
    ),
]


@router.get("/models", response_model=ModelsListResponse)
async def list_models():
    return ModelsListResponse(models=STATIC_MODELS)


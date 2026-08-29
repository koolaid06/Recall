from abc import ABC, abstractmethod

class AIProvider(ABC):

    @abstractmethod
    async def analyze_media(self, file_path: str):
        pass

    @abstractmethod
    async def answer_question(self, question: str, context):
        pass
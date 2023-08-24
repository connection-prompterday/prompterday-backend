import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { GetAdviseDto } from './dto/get-advise.dto';
import { NutritionistResponse } from './interface/interface';
import { ExtractIngredientsDto } from './dto/extract-ingredients-dto';
import { ExtractTarget } from './enum/enum';

@Injectable()
export class ChatGptService {
  private openAi: OpenAIApi;
  private openAiModel: string;
  private nutritionistSystemSetup: string;
  private nutritionistUserSetup: string;
  private assistantSetup: string;
  private extractorNutritionistSetup: string;
  private chemistSystemSetup: string;
  private extractorChemistSetup: string;

  constructor(private readonly configService: ConfigService) {
    const configuration = new Configuration({
      apiKey: configService.get<string>('OPENAI_SECRET_KEY'),
    });

    this.openAi = new OpenAIApi(configuration);
    this.openAiModel = configService.get<string>('OPENAI_MODEL');
    this.nutritionistSystemSetup = configService.get<string>(
      'NUTRITIONIST_SYSTEM_SETUP',
    );
    this.nutritionistUserSetup = configService.get<string>(
      'NUTRITIONIST_USER_SETUP',
    );
    this.assistantSetup = configService.get<string>('ASSISTANT_SETUP');
    this.extractorNutritionistSetup = configService.get<string>(
      'EXTRACTOR_NUTRITIONIST_SETUP',
    );
    this.chemistSystemSetup = configService.get<string>('CHEMIST_SYSTEM_SETUP');
    this.extractorChemistSetup = configService.get<string>(
      'EXTRACTOR_CHEMIST_SETUP',
    );
  }

  async getAdviseFromNutritionist(
    getAdviseDto: GetAdviseDto,
  ): Promise<NutritionistResponse[]> {
    const messages: ChatCompletionRequestMessage[] =
      this.createNutritionistRequestMessages(getAdviseDto);
    const answer: NutritionistResponse[] =
      await this.fetchChatGptResponse(messages);

    return answer;
  }

  private createNutritionistRequestMessages(
    getAdviseDto: GetAdviseDto,
  ): ChatCompletionRequestMessage[] {
    const messages: ChatCompletionRequestMessage[] = [
      {
        role: 'system',
        content: this.nutritionistSystemSetup,
      },
      { role: 'user', content: this.nutritionistUserSetup },
      {
        role: 'assistant',
        content: this.assistantSetup,
      },
      {
        role: 'user',
        content: `diseases:${getAdviseDto.diseases},ingredients: ${getAdviseDto.ingredients}`,
      },
    ];

    return messages;
  }

  async extractIngredients(extractIngredientsDto: ExtractIngredientsDto) {
    const messages: ChatCompletionRequestMessage[] =
      this.createExtractRequestMessage(extractIngredientsDto);

    const extractedIngredients: string[] =
      await this.fetchChatGptResponse(messages);

    return extractedIngredients;
  }

  private createExtractRequestMessage(
    extractIngredientsDto: ExtractIngredientsDto,
  ): ChatCompletionRequestMessage[] {
    if (extractIngredientsDto.extractTarget === ExtractTarget.NUTRITIONIST) {
      const messages: ChatCompletionRequestMessage[] = [
        {
          role: 'system',
          content: this.nutritionistSystemSetup,
        },
        { role: 'user', content: this.extractorNutritionistSetup },
        {
          role: 'assistant',
          content: this.assistantSetup,
        },
        {
          role: 'user',
          content: `description: ${extractIngredientsDto.description}`,
        },
      ];

      return messages;
    } else if (extractIngredientsDto.extractTarget === ExtractTarget.CHEMIST) {
      const messages: ChatCompletionRequestMessage[] = [
        {
          role: 'system',
          content: this.chemistSystemSetup,
        },
        { role: 'user', content: this.extractorChemistSetup },
        {
          role: 'assistant',
          content: this.assistantSetup,
        },
        {
          role: 'user',
          content: `description: ${extractIngredientsDto.description}`,
        },
      ];

      return messages;
    }
  }

  private async fetchChatGptResponse(messages) {
    try {
      const response = await this.openAi.createChatCompletion({
        model: this.openAiModel,
        messages: messages,
        temperature: 0,
        max_tokens: 2000,
      });

      if (response.data.choices[0].message) {
        const answer = response.data.choices[0].message.content;
        const parsedAnswer = JSON.parse(answer);

        return parsedAnswer;
      }
    } catch (error) {
      throw new InternalServerErrorException(`서버 연결 오류입니다.`);
    }
  }
}

import { GoogleGenAI, Type } from "@google/genai";
import { Restaurant, MenuItem } from '../types';

// Initialize the client with the environment variable as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const menuItemSchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: '菜色名稱 (Name of the dish.)',
        },
        price: {
            type: Type.STRING,
            description: '菜色價格，可以是數字或文字，例如 "NT$250" 或 "時價"。 (Price of the dish, can be a number or text like "NT$250" or "Market Price".)',
        },
    },
    required: ['name', 'price'],
};

const restaurantSchema = {
  type: Type.OBJECT,
  properties: {
    ranking: {
        type: Type.INTEGER,
        description: '從1到5的排名，1是最佳推薦。(A ranking from 1 to 5, where 1 is the most recommended.)'
    },
    name: {
      type: Type.STRING,
      description: '餐廳名稱 (The name of the restaurant.)',
    },
    cuisine: {
      type: Type.STRING,
      description: '菜系或類型 (The type of cuisine, e.g., Italian, Sushi, Cafe.)',
    },
    address: {
      type: Type.STRING,
      description: '餐廳的完整地址 (The full address of the restaurant.)',
    },
    description: {
      type: Type.STRING,
      description: '一句吸引人的簡短描述 (A short, enticing one-sentence description.)',
    },
    hours: {
      type: Type.STRING,
      description: '餐廳的營業時間，例如 "週一至週五 11:00-21:00"。 (The business hours of the restaurant, e.g., "Mon-Fri 11:00-21:00".)',
    },
    review: {
        type: Type.STRING,
        description: '一段約50-70字的吸引人評論，描述餐廳的氛圍、特色菜和整體體驗。(An engaging review of about 50-70 words describing the restaurant\'s atmosphere, specialty dishes, and overall experience.)'
    },
    menu: {
        type: Type.ARRAY,
        description: '推薦的3-4道招牌菜色列表。(A list of 3-4 recommended signature dishes.)',
        items: menuItemSchema,
    },
    imagePrompt: {
        type: Type.STRING,
        description: '一個簡短的英文描述，用於生成這家餐廳食物的圖片。例如："Delicious bowl of beef noodle soup with steam" 或 "Fresh sushi platter on wooden table"。 (A short English description to generate an image of this restaurant\'s food.)'
    }
  },
  required: ['ranking', 'name', 'cuisine', 'address', 'description', 'hours', 'review', 'menu', 'imagePrompt'],
};

export async function fetchRestaurants(lat: number, lon: number, cuisine: string, distance: string): Promise<Restaurant[]> {
  try {
    const cuisineText = cuisine === '全部' ? '各種類型' : cuisine;
    
    const prompt = `
      請根據我目前的位置 (緯度: ${lat}, 經度: ${lon})，推薦5家"${cuisineText}"餐廳。
      
      篩選條件：
      1. 距離範圍：請盡量選擇距離我 ${distance} 以內的餐廳。
      2. 請從1到5排名 (1是最佳推薦)。
      3. 為每家餐廳提供營業時間、3-4道招牌菜色及其價格。
      4. 撰寫一段約50-70字的吸引人評論。
      5. 提供一個英文的 imagePrompt 用來生成圖片。
      
      請用繁體中文回答其他內容。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: restaurantSchema,
        },
        temperature: 0.7,
      },
    });

    const jsonString = response.text;
    // Handle case where response text might be undefined or empty
    if (!jsonString) {
        throw new Error("Empty response from AI model");
    }

    const result = JSON.parse(jsonString) as Restaurant[];
    
    if (Array.isArray(result) && result.length > 0) {
      // Sort by ranking to ensure the display order is correct
      result.sort((a, b) => a.ranking - b.ranking);
      return result;
    }
    return [];

  } catch (error) {
    console.error('Error fetching restaurant recommendations:', error);
    throw error; 
  }
}
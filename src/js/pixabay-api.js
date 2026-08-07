//Для організації коду використовуй модульність та синтаксис export/import.
//У файлі pixabay-api.js зберігай функції для виконання HTTP-запитів:
//getImagesByQuery(query). Ця функція повинна приймати один параметр query (пошукове слово, яке є рядком), здійснювати HTTP-запит і повертати значення властивості data з отриманої відповіді.

import axios from "axios";

const API_KEY = "56897877-369a2b1f62c21f25620e74b5c";
const BASE_URL = "https://pixabay.com/api/";

export async function getImagesByQuery(query, page = 1) {
    const response = await axios.get(BASE_URL, {
        params: {
            key: API_KEY,
            q: query,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page,
            per_page: 15,
        },
    });
    return response.data;
}
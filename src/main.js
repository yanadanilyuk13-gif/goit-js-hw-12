
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import './css/styles.css';


import { getImagesByQuery } from "./js/pixabay-api";
import {
    createGallery,
    clearGallery,
    showLoader,
    hideLoader,
    showLoadMoreButton,
    hideLoadMoreButton

} from "./js/render-functions";

const form = document.querySelector(".form");
const loadMore = document.querySelector("#load-more");

let page = 1;
let query = "";
let totalPages = 0;

form.addEventListener("submit", onSubmit);
loadMore.addEventListener("click", onLoadMore);

async function onSubmit(event) {
    event.preventDefault();

    query = event.currentTarget.elements["search-text"].value.trim();
    page = 1;
    if (!query) {
        iziToast.error({
            message:
                "Please enter a search query!",
        });
        return;
    }
    clearGallery();
    hideLoadMoreButton();
    showLoader();

    try {
        const data = await getImagesByQuery(query, page);

        if (data.hits.length === 0) {
            iziToast.error({
                message:
                    "Sorry, there are no images matching your search query. Please try again!",
            });
            return;
        }

        totalPages = Math.ceil(data.totalHits / 15);
        createGallery(data.hits);

        if (page < totalPages) {
            showLoadMoreButton();
        } else {
            hideLoadMoreButton();
            iziToast.info({
                message: "We're sorry, but you've reached the end of search results.",
            });
        }

    } catch (error) {
        console.error(error);
        iziToast.error({
            message: "Something went wrong!",
        });
    } finally {
        hideLoader();
    }
}

async function onLoadMore() {
    page += 1;
    hideLoadMoreButton();
    showLoader();
    loadMore.disabled = true;

    try {
        const data = await getImagesByQuery(query, page);
        createGallery(data.hits);

        if (page < totalPages) {
            showLoadMoreButton();
        } else {
            hideLoadMoreButton();
            iziToast.info({
                message: "We're sorry, but you've reached the end of search results.",
            });
        }

        const card = document.querySelector(".photo-card");
        const cardHeight = card.getBoundingClientRect().height;

        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });
    } catch (error) {
        console.error(error);
        iziToast.error({
            message: "Something went wrong!",
        });
    } finally {
        loadMore.disabled = false;
        hideLoader();
    }
}
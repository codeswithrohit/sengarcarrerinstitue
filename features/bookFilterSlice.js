import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    bookList: {
        category: [],
        categorySelect: "",
        instructor: [],
        instructorSelect: "",
        price: [],
        priceSelect: "",
        language: [],
        languageSelect: "",
        difficulty: [],
        difficultySelect: "",
    },
    bookSort: {
        sort: "",
        perPage: {
            start: 0,
            end: 0,
        },
    },
}

export const courseFilterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        addCategory: (state, { payload }) => {
            const isExist = state.bookList.category.includes(payload)
            if (!isExist) {
                state.bookList.category.push(payload)
            } else {
                state.bookList.category = state.bookList.category.filter(
                    (item) => item !== payload
                )
            }
        },
        addCategorySelect: (state, { payload }) => {
            state.bookList.categorySelect = payload
        },
        clearCategory: (state) => {
            state.bookList.category = []
        },



        addInstructor: (state, { payload }) => {
            const isExist = state.bookList.instructor.includes(payload)
            if (!isExist) {
                state.bookList.instructor.push(payload)
            } else {
                state.bookList.instructor = state.bookList.instructor.filter(
                    (item) => item !== payload
                )
            }
        },
        addInstructorSelect: (state, { payload }) => {
            state.bookList.instructorSelect = payload
        },
        clearInstructor: (state) => {
            state.bookList.instructor = []
        },



        addPrice: (state, { payload }) => {
            const isExist = state.bookList.price.includes(payload)
            if (!isExist) {
                state.bookList.price.push(payload)
            } else {
                state.bookList.price = state.bookList.price.filter(
                    (item) => item !== payload
                )
            }
        },
        addPriceSelect: (state, { payload }) => {
            state.bookList.priceSelect = payload
        },
        clearPrice: (state) => {
            state.bookList.price = []
        },


        addLanguage: (state, { payload }) => {
            const isExist = state.bookList.language.includes(payload)
            if (!isExist) {
                state.bookList.language.push(payload)
            } else {
                state.bookList.language = state.bookList.language.filter(
                    (item) => item !== payload
                )
            }
        },
        addLanguageSelect: (state, { payload }) => {
            state.bookList.languageSelect = payload
        },
        clearLanguage: (state) => {
            state.bookList.language = []
        },


        addDifficulty: (state, { payload }) => {
            const isExist = state.bookList.difficulty.includes(payload)
            if (!isExist) {
                state.bookList.difficulty.push(payload)
            } else {
                state.bookList.difficulty = state.bookList.difficulty.filter(
                    (item) => item !== payload
                )
            }
        },
        addDifficultySelect: (state, { payload }) => {
            state.bookList.difficultySelect = payload
        },
        clearDifficulty: (state) => {
            state.bookList.difficulty = []
        },

        addSort: (state, { payload }) => {
            state.bookSort.sort = payload
        },
        addPerPage: (state, { payload }) => {
            state.bookSort.perPage.start = payload.start
            state.bookSort.perPage.end = payload.end
        },
    },
})

export const {
    addCategory,
    addInstructor,
    addPrice,
    addLanguage,
    addDifficulty,
    addInstructorSelect,
    addCategorySelect,
    addPriceSelect,
    addLanguageSelect,
    addDifficultySelect,
    clearCategory,
    clearInstructor,
    clearPrice,
    clearLanguage,
    clearDifficulty,
    addSort,
    addPerPage,
} = courseFilterSlice.actions

export default courseFilterSlice.reducer

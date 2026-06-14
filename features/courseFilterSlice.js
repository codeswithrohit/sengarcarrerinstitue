import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    courseList: {
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
    courseSort: {
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
            const isExist = state.courseList.category.includes(payload)
            if (!isExist) {
                state.courseList.category.push(payload)
            } else {
                state.courseList.category = state.courseList.category.filter(
                    (item) => item !== payload
                )
            }
        },
        addCategorySelect: (state, { payload }) => {
            state.courseList.categorySelect = payload
        },
        clearCategory: (state) => {
            state.courseList.category = []
        },

        addInstructor: (state, { payload }) => {
            const isExist = state.courseList.instructor.includes(payload)
            if (!isExist) {
                state.courseList.instructor.push(payload)
            } else {
                state.courseList.instructor = state.courseList.instructor.filter(
                    (item) => item !== payload
                )
            }
        },
        addInstructorSelect: (state, { payload }) => {
            state.courseList.instructorSelect = payload
        },
        clearInstructor: (state) => {
            state.courseList.instructor = []
        },

        addPrice: (state, { payload }) => {
            const isExist = state.courseList.price.includes(payload)
            if (!isExist) {
                state.courseList.price.push(payload)
            } else {
                state.courseList.price = state.courseList.price.filter(
                    (item) => item !== payload
                )
            }
        },
        addPriceSelect: (state, { payload }) => {
            state.courseList.priceSelect = payload
        },
        clearPrice: (state) => {
            state.courseList.price = []
        },


        addLanguage: (state, { payload }) => {
            const isExist = state.courseList.language.includes(payload)
            if (!isExist) {
                state.courseList.language.push(payload)
            } else {
                state.courseList.language = state.courseList.language.filter(
                    (item) => item !== payload
                )
            }
        },
        addLanguageSelect: (state, { payload }) => {
            state.courseList.languageSelect = payload
        },
        clearLanguage: (state) => {
            state.courseList.language = []
        },


        addDifficulty: (state, { payload }) => {
            const isExist = state.courseList.difficulty.includes(payload)
            if (!isExist) {
                state.courseList.difficulty.push(payload)
            } else {
                state.courseList.difficulty = state.courseList.difficulty.filter(
                    (item) => item !== payload
                )
            }
        },
        addDifficultySelect: (state, { payload }) => {
            state.courseList.difficultySelect = payload
        },
        clearDifficulty: (state) => {
            state.courseList.difficulty = []
        },

        addSort: (state, { payload }) => {
            state.courseSort.sort = payload
        },
        addPerPage: (state, { payload }) => {
            state.courseSort.perPage.start = payload.start
            state.courseSort.perPage.end = payload.end
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

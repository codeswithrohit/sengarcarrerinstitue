import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    latestJob: [],

    category: [
        { id: 1, name: "Art Design", value: "artdesign", isChecked: false },
        { id: 2, name: "Business", value: "business", isChecked: false },
        { id: 3, name: "Data Science", value: "datascience", isChecked: false },
        { id: 4, name: "Development", value: "development", isChecked: false },
        { id: 5, name: "Finance", value: "finance", isChecked: false },
    ],
    instructors: [
        { id: 1, name: "Kiran Molly", value: "kiranmolly", isChecked: false },
        { id: 2, name: "Jackson Alive", value: "jacksonalive", isChecked: false },
        { id: 3, name: "Oawe Alve", value: "oawealve", isChecked: false },
        { id: 4, name: "Liakon Rivey", value: "liakonrivey", isChecked: false },
        { id: 5, name: "Foley Patrik", value: "foleypatrik", isChecked: false },
    ],
    price: [
        { id: 1, name: "Free", value: "free", isChecked: false },
        { id: 2, name: "Premium", value: "premium", isChecked: false }
    ],
    language: [
        { id: 1, name: "China", value: "china", isChecked: false },
        { id: 2, name: "English", value: "english", isChecked: false },
        { id: 3, name: "French", value: "french", isChecked: false },
        { id: 4, name: "German", value: "german", isChecked: false },
        { id: 5, name: "Italian", value: "italian", isChecked: false },
        { id: 6, name: "Spanish", value: "spanish", isChecked: false }
    ],
    difficulty: [
        { id: 1, name: "Beginner", value: "beginner", isChecked: false },
        { id: 2, name: "Intermediate", value: "intermediate", isChecked: false },
        { id: 3, name: "Expert", value: "expert", isChecked: false }
    ],
    rating: [
        { id: 1, name: "one", value: "one", isChecked: false },
        { id: 2, name: "Two", value: "two", isChecked: false },
        { id: 3, name: "Three", value: "three", isChecked: false },
        { id: 4, name: "Four", value: "four", isChecked: false },
        { id: 5, name: "Five", value: "five", isChecked: false }
    ],
}

export const jobSlice = createSlice({
    name: "book",
    initialState,
    reducers: {
        categoryCheck: (state, { payload }) => {
            state?.category?.map((item) => {
                if (item.id === payload) {
                    if (item.isChecked) {
                        item.isChecked = false
                    } else {
                        item.isChecked = true
                    }
                }
                return {
                    ...item,
                }
            })
        },
        clearCategoryToggle: (state) => {
            state?.category?.map((item) => {
                item.isChecked = false
                return {
                    ...item,
                }
            })
        },

        instructorsCheck: (state, { payload }) => {
            state?.instructors?.map((item) => {
                if (item.id === payload) {
                    if (item.isChecked) {
                        item.isChecked = false
                    } else {
                        item.isChecked = true
                    }
                }
                return {
                    ...item,
                }
            })
        },
        clearInstructorToggle: (state) => {
            state?.instructors?.map((item) => {
                item.isChecked = false
                return {
                    ...item,
                }
            })
        },

        priceCheck: (state, { payload }) => {
            state?.price?.map((item) => {
                if (item.id === payload) {
                    if (item.isChecked) {
                        item.isChecked = false
                    } else {
                        item.isChecked = true
                    }
                }
                return {
                    ...item,
                }
            })
        },
        clearPriceToggle: (state) => {
            state?.price?.map((item) => {
                item.isChecked = false
                return {
                    ...item,
                }
            })
        },


        languageCheck: (state, { payload }) => {
            state?.language?.map((item) => {
                if (item.id === payload) {
                    if (item.isChecked) {
                        item.isChecked = false
                    } else {
                        item.isChecked = true
                    }
                }
                return {
                    ...item,
                }
            })
        },
        clearLanguageToggle: (state) => {
            state?.language?.map((item) => {
                item.isChecked = false
                return {
                    ...item,
                }
            })
        },


        difficultyCheck: (state, { payload }) => {
            state?.difficulty?.map((item) => {
                if (item.id === payload) {
                    if (item.isChecked) {
                        item.isChecked = false
                    } else {
                        item.isChecked = true
                    }
                }
                return {
                    ...item,
                }
            })
        },
        clearDifficultyToggle: (state) => {
            state?.difficulty?.map((item) => {
                item.isChecked = false
                return {
                    ...item,
                }
            })
        },
    },
})

export const {
    instructorsCheck,
    categoryCheck,
    priceCheck,
    languageCheck,
    difficultyCheck,
    clearInstructorToggle,
    clearCategoryToggle,
    clearPriceToggle,
    clearLanguageToggle,
    clearDifficultyToggle,
} = jobSlice.actions

export default jobSlice.reducer

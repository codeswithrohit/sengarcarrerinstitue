import { configureStore } from "@reduxjs/toolkit"
import bookFilterSlice from "./bookFilterSlice"
import bookSlice from "./bookSlice"
import courseFilterSlice from "./courseFilterSlice"
import courseSlice from "./courseSlice"

export const store = configureStore({
    reducer: {
        course: courseSlice,
        book: bookSlice,
        courseFilter: courseFilterSlice,
        bookFilter: bookFilterSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
})

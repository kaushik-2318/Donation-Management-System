import { createSlice } from "@reduxjs/toolkit"



const initialState = {
  posts: [],
  loading: false,
  error: null,
}

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload
      state.loading = false
      state.error = null
    },
    addPost: (state, action) => {
      state.posts.push(action.payload)
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex((post) => post.id === action.payload.id)
      if (index !== -1) {
        state.posts[index] = action.payload
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setPosts, addPost, updatePost, deletePost, setLoading, setError } = postSlice.actions

export const selectPosts = (state) => state.post.posts
export const selectPostLoading = (state) => state.post.loading
export const selectPostError = (state) => state.post.error

export default postSlice.reducer


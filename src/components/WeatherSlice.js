import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_KEY = '73f451ba777b4f85a2c75327242612';
const BASE_URL = 'https://api.weatherapi.com/v1';

// Async thunk for fetching current weather
export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrentWeather',
  async (location, thunkAPI) => {
    try {
      const response = await fetch(
        `${BASE_URL}/current.json?key=${API_KEY}&q=${location}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch current weather data');
      }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching 5-day forecast
export const fetchForecastWeather = createAsyncThunk(
  'weather/fetchForecastWeather',
  async ({ location, days = 5 }, thunkAPI) => {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&days=${days}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    current: null,
    location:null,
    forecast: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        console.log('API Response: ', action.payload);
        state.loading = false;
        state.current = action.payload.current;
        state.location = action.payload.location;
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchForecastWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecastWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.forecast = action.payload.forecast.forecastday;
      })
      .addCase(fetchForecastWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default weatherSlice.reducer;

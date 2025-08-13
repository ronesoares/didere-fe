import { createContext, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import authService from '../services/api/auth';

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  loading: false,
};

const ActionType = {
  INITIALIZE: 'INITIALIZE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  UPDATE_USER: 'UPDATE_USER',
};

const handlers = {
  [ActionType.INITIALIZE]: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      loading: false,
    };
  },
  [ActionType.LOGIN]: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      loading: false,
    };
  },
  [ActionType.LOGOUT]: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    loading: false,
  }),
  [ActionType.SET_LOADING]: (state, action) => ({
    ...state,
    loading: action.payload,
  }),
  [ActionType.UPDATE_USER]: (state, action) => ({
    ...state,
    user: { ...state.user, ...action.payload },
  }),
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  updateProfile: () => Promise.resolve(),
  changePassword: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        dispatch({ type: ActionType.SET_LOADING, payload: true });

        if (authService.isAuthenticated()) {
          const user = await authService.getProfile();

          dispatch({
            type: ActionType.INITIALIZE,
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: ActionType.INITIALIZE,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        authService.logout();
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: ActionType.SET_LOADING, payload: true });
      
      const { user } = await authService.login(email, password);

      dispatch({
        type: ActionType.LOGIN,
        payload: { user },
      });

      return user;
    } catch (error) {
      dispatch({ type: ActionType.SET_LOADING, payload: false });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: ActionType.SET_LOADING, payload: true });
      
      const result = await authService.register(userData);
      
      dispatch({ type: ActionType.SET_LOADING, payload: false });
      
      return result;
    } catch (error) {
      dispatch({ type: ActionType.SET_LOADING, payload: false });
      throw error;
    }
  };

  const logout = async () => {
    try {
      authService.logout();
      dispatch({ type: ActionType.LOGOUT });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      
      dispatch({
        type: ActionType.UPDATE_USER,
        payload: updatedUser,
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      return await authService.changePassword(currentPassword, newPassword);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};


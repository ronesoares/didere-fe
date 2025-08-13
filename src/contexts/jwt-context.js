import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import authorizationService from '../services/auth/authorization-service';

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  })
};

const reducer = (state, action) => (handlers[action.type]
  ? handlers[action.type](state, action)
  : state);

export const AuthContext = createContext({
  ...initialState,
  platform: 'JWT',
  login: () => Promise.resolve(),
  loginGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken) {
          const user = await authorizationService.getUser();

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    await authorizationService.loginWithPassword(email, password);
    const user = await authorizationService.getUser();

    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  };

  const loginGoogle = async (email, token, refreshToken, idUser) => {
    await authorizationService.loginWithGoogleToken(email, token, refreshToken, idUser);
    const user = await authorizationService.getUser();

    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  };

  const logout = async () => {
    authorizationService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'JWT',
        login,
        loginGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
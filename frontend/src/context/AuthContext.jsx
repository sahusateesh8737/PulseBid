import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { MOCK_USERS, DEMO_TENANTS } from '../api/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('pulsebid_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('pulsebid_token') || null);
  const [tenantId, setTenantId] = useState(() => localStorage.getItem('pulsebid_tenant_id') || 'tenant-alpha');
  const [activeTenant, setActiveTenant] = useState(() => {
    const savedId = localStorage.getItem('pulsebid_tenant_id') || 'tenant-alpha';
    return DEMO_TENANTS.find((t) => t.id === savedId) || DEMO_TENANTS[0];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sync state changes with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('pulsebid_token', token);
    } else {
      localStorage.removeItem('pulsebid_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pulsebid_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pulsebid_user');
    }
  }, [user]);

  useEffect(() => {
    if (tenantId) {
      localStorage.setItem('pulsebid_tenant_id', tenantId);
      const tenant = DEMO_TENANTS.find((t) => t.id === tenantId) || { id: tenantId, name: tenantId, code: tenantId.toUpperCase() };
      setActiveTenant(tenant);
    }
  }, [tenantId]);

  // Listen for 401 unauthorized events from Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('pulsebid:unauthorized', handleUnauthorized);
    setIsLoading(false);
    return () => {
      window.removeEventListener('pulsebid:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password, selectedTenantId = tenantId) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      // Attempt API login first
      const response = await apiClient.post('/auth/login', { email, password, tenantId: selectedTenantId });
      
      const userData = response.data?.data?.user || response.data?.user || response.user;
      const tokenData = response.data?.data?.accessToken || response.data?.accessToken || response.token;

      setUser(userData);
      setToken(tokenData);
      if (userData?.tenantId || userData?.tenant_id) {
        setTenantId(userData.tenantId || userData.tenant_id);
      }
      return { success: true, user: userData };
    } catch (err) {
      // Fallback for hackathon demo mode if backend server is not running
      const matchedUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (matchedUser) {
        const mockToken = `mock_jwt_token_${Date.now()}`;
        const userObj = { ...matchedUser, tenantId: selectedTenantId };
        setUser(userObj);
        setToken(mockToken);
        setTenantId(selectedTenantId);
        setIsLoading(false);
        return { success: true, user: userObj, isDemo: true };
      }

      const msg = err.message || 'Invalid credentials or connection failed';
      setAuthError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemoUser = (role = 'BIDDER', customTenantId = tenantId) => {
    const target = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
    const demoUser = {
      ...target,
      tenantId: customTenantId,
    };
    const mockToken = `demo_token_${role}_${Date.now()}`;
    setUser(demoUser);
    setToken(mockToken);
    setTenantId(customTenantId);
    return demoUser;
  };

  const register = async (name, email, password, company, selectedTenantId = tenantId) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await apiClient.post('/auth/signup/create-org', {
        name,
        email,
        password,
        orgName: company || 'Personal Account',
        industry: 'Other'
      });

      const userData = response.data?.data?.user || response.data?.user || response.user;
      const tokenData = response.data?.data?.accessToken || response.data?.accessToken || response.token;

      setUser(userData);
      setToken(tokenData);
      if (userData?.tenantId || userData?.tenant_id) {
        setTenantId(userData.tenantId || userData.tenant_id);
      }
      return { success: true, user: userData };
    } catch (err) {
      // Fallback for Demo Mode
      const newUser = {
        id: `usr_${Date.now()}`,
        name,
        email,
        role: 'BIDDER',
        tenantId: selectedTenantId,
        tenantName: company || 'Personal Account',
      };
      const mockToken = `mock_token_reg_${Date.now()}`;
      setUser(newUser);
      setToken(mockToken);
      setTenantId(selectedTenantId);
      setIsLoading(false);
      return { success: true, user: newUser, isDemo: true };
    } finally {
      setIsLoading(false);
    }
  };

  const switchTenant = (newTenantId) => {
    setTenantId(newTenantId);
    if (user) {
      setUser((prev) => (prev ? { ...prev, tenantId: newTenantId } : null));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pulsebid_token');
    localStorage.removeItem('pulsebid_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        tenantId,
        activeTenant,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'ADMIN',
        isLoading,
        authError,
        login,
        register,
        logout,
        switchTenant,
        loginAsDemoUser,
        tenants: DEMO_TENANTS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

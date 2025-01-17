import React, {createContext, useState, useEffect, ReactNode, useContext} from 'react';

type AppState = {
    userEmail: string | null;
    isAuthenticated: boolean;
    userType: string | null;
    setUserEmail: (userEmail: string | null) => void;
    setIsAuthenticated: (auth: boolean) => void;
    setUserType: (type: string | null) => void;
};

export const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('userEmail'));
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('isAuthenticated') === 'true'
    );
    const [userType, setUserType] = useState(localStorage.getItem('userType'));

    useEffect(() => {
        localStorage.setItem('userEmail', userEmail || '');
        localStorage.setItem('isAuthenticated', String(isAuthenticated));
        localStorage.setItem('userType', userType || '');
    }, [userEmail, isAuthenticated, userType]);

    return (
        <AppStateContext.Provider value={{ userEmail, isAuthenticated, userType, setUserType, setUserEmail, setIsAuthenticated }}>
            {children}
        </AppStateContext.Provider>
    );
};

// Hook to make using the context in a simpler way
export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
};


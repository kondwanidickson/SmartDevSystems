import * as React from 'react';

const ApiContext = React.createContext();

function ContextProvider({ children }){
    const _currency = localStorage.getItem('sds_currency');
    const [currency, setCurrency] = React.useState(_currency ? _currency : "MWK");

    return(
        <ApiContext.Provider 
            value={{
                // react states
                setCurrency,
                currency,
            }}
        >
          {children}
        </ApiContext.Provider>
    );
}

export { ContextProvider, ApiContext };
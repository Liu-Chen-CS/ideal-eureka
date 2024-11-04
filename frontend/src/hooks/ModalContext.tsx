import {createContext, ReactNode, useContext, useState} from "react";

interface ModalContextProps {
    isModalVisible: boolean;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(!sessionStorage.getItem('demoNoticeAcknowledged'));

    const closeModal = ():void => {
        setIsModalVisible(false);
        sessionStorage.setItem('demoNoticeAcknowledged', 'true');
    };

    return (
        <ModalContext.Provider value={{isModalVisible, closeModal}}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal 必须在 ModalProvider 内使用');
    }
    return context;
};


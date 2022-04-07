import {
    IonHeader,
    IonRouterLink,
    IonIcon,
    IonToolbar,
    IonMenuButton,
	IonButton,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router';
import {
    arrowBack, moon, search, sunny,
} from 'ionicons/icons';
import { queryClient } from "../../queryClient";
import SearchBar from "../SearchBar";
import useConnectWallet from "../../hooks/useConnectWallet";
import WalletButton from "../WalletButton";
import Help from "../Help";
import { css } from "@emotion/react";
import "./Header.scss"
import usePersistentState from "../../hooks/usePersistentState";


const HeaderContainer = () => {
    const { id } = useParams<{ id?: string; }>()
    let history = useHistory();
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const smallHeaderWidth = 1024; // what size browser needs to be, before header goes small mode

    const connectWallet = useConnectWallet();

    const [headerPlaceholder, setHeaderPlaceholder] = useState('');


	const [mode, setMode] = usePersistentState<"dark" | "light">("mode", "dark");

    // onload useEffect
    useEffect(() => {
        const onLoad = async () => {
            // connecting SOL wallet
            try {
                await connectWallet({ onlyIfTrusted: true });
            } catch (error) {
                console.error(error);
            }
        };

        // resize window stuff
        function resizeWidth() {
            if (window.innerWidth > smallHeaderWidth) {
                setShowMobileSearch(false);
            }
            smallPlaceholder();
        }
        // set the placeholder of the header search bar
        function smallPlaceholder() {
            if (window.innerWidth > 1000) {
                setHeaderPlaceholder("Search Discord/tweets & view graphs");
            } else {
                setHeaderPlaceholder("Type then press enter");
            }
        }

        window.addEventListener("resize", resizeWidth);

        onLoad();
        resizeWidth();

        return () => {
            window.removeEventListener("resize", resizeWidth)
        };
    }, [connectWallet]);


    // does the search functionality
    function handleSearch(val: string) {
        val = val.trim();

        if (val.length === 0) return;
        const queryKey = ["messages", id];
        queryClient.resetQueries(queryKey);
        history.push(`/search/${encodeURIComponent(val)}`);
    }

    /**
     * Renders
     */

    return (
        <>
            <IonHeader
                className={`py-2 ${showMobileSearch ? 'px-2' : 'pr-10'}`}
                css={css`
                    --background: var(--ion-background-color);
                    ion-toolbar {
                        background-color: var(--background);
                    }
                `}
            >
                <IonToolbar>
                    <div className="justify-between space-x-8 flex items-center">
                        {/*pt-3*/}
                        {!showMobileSearch && (
                            <div className="flex items-center space-x-4">
                                {/*hamburger sidebar*/}
                                <IonMenuButton
                                    color="white"
                                    menu="sidebar"
                                    className="md:hidden ion-no-padding"
                                    css={css`
                                        font-size: 32px;
                                    `}
                                />

                                {/*site logo & home*/}
                                <IonRouterLink
                                    className="text-2xl logo"
                                    routerLink="/"
                                    color="text"
                                >
                                    <div className="flex items-center space-x-3">
                                        <img
                                            className="logo-height"
                                            src="/assets/site-logos/logo-transparent.png"
                                            alt="logo"
                                        />
                                        <p className="headerName">
                                            SOL Decoder
                                        </p>
                                    </div>
                                </IonRouterLink>
                            </div>
                        )}

                        <div
                            className={`flex-grow flex items-center ${
                                showMobileSearch
                                    ? 'space-x-8'
                                    : 'lg:max-w-xl justify-end lg:justify-start'
                            }`}
                        >
                            {showMobileSearch && (
                                <IonIcon
                                    slot="icon-only"
                                    icon={arrowBack}
                                    className="text-3xl cursor-pointer hover:opacity-80"
                                    onClick={() => setShowMobileSearch(false)}
                                />
                            )}
                            <div
                                className={`flex-grow flex items-baseline space-x-2 c-header-search ${
                                    showMobileSearch
                                        ? 'max-w-[50rem] px-3'
                                        : 'hidden lg:flex'
                                }`}
                            >
                                <SearchBar
                                    onSubmit={handleSearch}
                                    initialValue={decodeURIComponent(id ?? '')}
                                    placeholder={headerPlaceholder}
                                    disableReset
                                />

                                <span className="hidden sm:block">
                                    <Help
                                        description={`Does an exact match on a single word (ex. "catalina"), or does an exact match on multiple words (ex. "catalina whale"). Results include graphs, and messages you can scroll through. Click on a message to view more`}
                                    />
                                </span>
                            </div>
                            {!showMobileSearch && (
                                <IonIcon
                                    slot="icon-only"
                                    icon={search}
                                    className="lg:hidden cursor-pointer text-2xl hover:opacity-80"
                                    onClick={() => setShowMobileSearch(true)}
                                />
                            )}
                        </div>

                        <div
                            className="flex space-x-4 items-center"
                            hidden={showMobileSearch}
                        >
                            <IonButton
                                className="ml-auto"
                                onClick={() => {
                                    setMode(mode === 'dark' ? 'light' : 'dark');
                                }}
                                fill="clear"
                                color={mode === 'dark' ? 'light' : 'dark'}
                                shape="round"
                                css={css`
                                    --padding-horizontal: 4px;
                                    --padding-vertical: 4px;
                                    --padding-start: var(--padding-horizontal);
                                    --padding-end: var(--padding-horizontal);
                                    --padding-top: var(--padding-vertical);
                                    --padding-bottom: var(--padding-vertical);

                                    --dimensions: 48px;
                                    height: var(--dimensions);
                                    width: var(--dimensions);
                                `}
                            >
                                <IonIcon
                                    icon={mode === 'dark' ? sunny : moon}
                                    className="h-7 w-7"
                                />
                            </IonButton>
                            <div className="hidden md:flex items-center">
                                <WalletButton />
                            </div>
                        </div>
                    </div>
                </IonToolbar>
            </IonHeader>
        </>
    );
};

export default HeaderContainer;
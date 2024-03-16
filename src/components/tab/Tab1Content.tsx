import React, {useEffect, useState} from 'react';
import {CHAIN, SendTransactionRequest} from "@tonconnect/sdk";
import {TonConnectButton, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";

import {Image, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure,} from '@nextui-org/react';
import {Progress} from "@nextui-org/progress";
import {Card, CardFooter, CardHeader} from "@nextui-org/card";
import {Button} from "@nextui-org/button";
import {ENDPOINT_TESTNET_RPC, t404_jetton_master_address, t404_jetton_master_address_raw} from "@/constant/trc404";
import {Address} from "@ton/core";
import {TonClient} from "@ton/ton";
import {Divider} from "@nextui-org/divider";


// 1 means 1 ton 1 T404
// 5 means 5 ton 1 T404
// TODO: to change for production 1
const baseRate: number = 1;
// TODO: to change for production 1
const endpoint = ENDPOINT_TESTNET_RPC;


function buildTx(base: number, amount: number): SendTransactionRequest {

    return {
        // TODO: to change for production 2
        // network: CHAIN.TESTNET,
        // The transaction is valid for 10 minutes from now, in unix epoch seconds.
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
            {
                address: t404_jetton_master_address_raw,
                amount: String(1000000000 * base * amount),
            },
        ],
    };

}


interface MintInfo {
    fetchFormRemote: boolean;
    freemintIsOpen?: boolean;
    freemintMaxSupply?: number;
    freemintCurrentSupply?: number;
    freemintTonPrice?: number;
    progressRate: number;
}


export default function Tab1Content() {


    const [mintInfo, setMintInfo] = useState<MintInfo>({fetchFormRemote: false, progressRate: 0});

    const [tx, setTx] = useState(buildTx(baseRate, 1));
    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();

    // process bar number
    const [progressNumber, setProgressNumber] = React.useState(20);

    // mint amount
    const [mintAmount, setMintAmount] = useState(1);

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const handleIncrement = () => {
        if (mintAmount < 5) {
            setMintAmount(mintAmount + 1);
            setTx(buildTx(baseRate, mintAmount + 1));
        }
    };

    const handleDecrement = () => {
        if (mintAmount >= 2) {
            setMintAmount(mintAmount - 1);
            setTx(buildTx(baseRate, mintAmount - 1));
        }
    };

    const handleSetValue = (val: number) => {
        if (val < 1 || val > 5) {
            setMintAmount(1);
        }
        setMintAmount(val);
    };

    React.useEffect(() => {
        const interval = setInterval(() => {
            setProgressNumber((v) => (v > 100 ? 100 : v + 1));
        }, 5000);

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const client = new TonClient(
                    {
                        endpoint: endpoint,
                    });

                const master_tx = await client.runMethod(
                    Address.parse(t404_jetton_master_address), 'get_jetton_data');
                // @ts-ignore
                let baseNano: bigint = 1000000000n;
                let master_result = master_tx.stack;
                let total_supply = master_result.readBigNumber();
                let mintable = master_result.readBoolean();
                let owner = master_result.readAddress();
                let content = master_result.readCell();
                let jetton_wallet_code = master_result.readCell();
                let nft_collection_address = master_result.readAddress();

                //-1:true(can mint), 0:false(can not)
                let freemint_flag = master_result.readNumber();

                //3 000000000n 当前已经 mint 的数字
                let freemint_current_supply = master_result.readBigNumber();
                let freemint_current_supply_number = Number(freemint_current_supply / baseNano);

                //1000 000000000n
                let freemint_max_supply = master_result.readBigNumber();
                let freemint_max_supply_number = Number(freemint_max_supply / baseNano);

                //1 000000000n
                let freemint_price = master_result.readBigNumber();


                let mintInfo: MintInfo = {
                    fetchFormRemote: true,
                    freemintIsOpen: freemint_flag == -1,
                    freemintCurrentSupply: freemint_current_supply_number,
                    freemintMaxSupply: freemint_max_supply_number,
                    freemintTonPrice: Number(freemint_price / baseNano),
                    progressRate: 100 * freemint_current_supply_number / freemint_max_supply_number,
                };

                setMintInfo(mintInfo);

                // console.log('get_jetton_data freemint_current_supply:', freemint_current_supply,
                //     ',freemint_max_supply:', freemint_max_supply, ",freemint_price", freemint_price,
                //     ',freemint_flag:', freemint_flag);

                console.log('convert: get_jetton_data freemint_current_supply:', mintInfo.freemintCurrentSupply,
                    ',freemint_max_supply:', mintInfo.freemintMaxSupply,
                    ",freemint_price", mintInfo.freemintTonPrice,
                    ',freemint_flag:', mintInfo.freemintIsOpen,
                    ',progressRate:', mintInfo.progressRate,
                    ',fetchFormRemote:', mintInfo.fetchFormRemote
                );

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Only execute fetchData if running in the browser
        if (typeof window !== "undefined") {
            fetchData().catch(r => {
                console.error("Sorry, I need window to run." + r)
            });
        }
    }, []);


    return (
        < div className="p-2">
            <div className="flex justify-between pb-3">
                <div className="flex gap-1">
                    <Image
                        alt="trc-404 logo"
                        height={40}
                        radius="sm"
                        src="/logos/logo-transparent.png"
                        width={40}
                    />
                    <div className="flex flex-col">
                        <p className="text-md">TRC-404</p>
                        <p className="text-small text-default-500">Probably not found</p>
                    </div>
                </div>
                <div className="flex-item ml-auto">
                    <TonConnectButton/>
                </div>
            </div>


            {/*  dd */}
            <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7">
                <CardHeader className="absolute z-10 top-1 flex-col items-start">
                    {/*<p className="text-tiny text-white/60 uppercase font-bold">Your day your way</p>*/}
                    {/*<h4 className="text-white/90 font-medium text-xl">Your checklist for better sleep</h4>*/}
                </CardHeader>
                <Image
                    removeWrapper
                    alt="Relaxing app background"
                    className="z-0 w-full h-full object-fill"
                    src="/vivid.png"
                />
                <CardFooter
                    className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                    <div className="flex flex-grow gap-2 items-center">
                        <div className="flex flex-col">
                            <p className="text-white/80">ERC-404</p>
                            <p className="text-tiny text-white/80 ">To Make NFT Flow and Fly!</p>
                        </div>
                    </div>
                </CardFooter>
            </Card>

            {/*dd qqq*/}

            {/*TODO: to change for production */}
            <div className="mt-8 mb-2 text-2xl">Free Mint <span className='text-yellow-600'>(Testnet)</span></div>
            <div className="flex flex-col">

                {mintInfo.fetchFormRemote && (<div className="flex justify-center text-gray-500">
                    Minted Count：{mintInfo.freemintCurrentSupply}
                </div>)}

                <div className="flex justify-center  text-gray-500">
                    Total Supply：1000
                </div>
                <div className="flex justify-center text-gray-500">
                    Period：2024/03/15 - 2024/03/29
                </div>
                {mintInfo.fetchFormRemote && (
                    <div className="flex justify-center ">
                        <Progress
                            aria-label="Loading..."
                            isStriped
                            size="md"
                            value={mintInfo.progressRate}
                            color="success"
                            formatOptions={{style: "percent", minimumIntegerDigits: 1, minimumFractionDigits: 1}}
                            showValueLabel={true}
                            className="max-w-md "
                        />
                    </div>)}

                <div className="flex flex-col mt-3">
                    {wallet ? (
                        <>
                            {/*mint amount start*/}
                            <div className="flex mb-2 items-center">
                                <div className="text-lg ">Mint Amount: &nbsp;</div>

                                <button
                                    className="focus:outline-none"
                                    onClick={handleDecrement}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>
                                </button>
                                <div className="mx-3"> {mintAmount} </div>

                                <button
                                    className="focus:outline-none"
                                    onClick={handleIncrement}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>

                                </button>
                            </div>
                            {/*mint amount end*/}

                            <Button size='lg' color="primary" onClick={() => {
                                console.info(wallet?.account)

                                {/* TODO: to change for production 4 */
                                }
                                if (wallet?.account.chain == CHAIN.MAINNET) {
                                    onOpen();
                                    return;
                                }

                                return tonConnectUi.sendTransaction(tx);
                            }
                            }>
                                Free Mint
                            </Button>

                        </>
                    ) : (
                        <Button size='lg' color="primary" onClick={() => {
                            return tonConnectUi.openModal();
                        }}>
                            Connect Wallet to Free Mint
                        </Button>
                    )}
                </div>
            </div>


            {/* FAQ   */}

            <div className="flex w-full flex-col pb-20">&nbsp;</div>

            {/* FAQ   */}

            {/*    Modal*/}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Testnet Only</ModalHeader>
                            <ModalBody>
                                <p>
                                    Thank you for participating in the TRC-404 beta test, you need to connect testnet,
                                    but you are currently
                                    connecting to
                                    the&nbsp;
                                    <span className="bg-yellow-100 text-red-700">mainnet</span> wallet.
                                </p>
                                <p>
                                    <h2>Mainnet</h2>
                                    <ul className="list-disc">
                                        <li>address start with <span className=" text-red-500">EQ</span>
                                        </li>
                                        <li>address start with <span className=" text-red-500">UQ</span>
                                        </li>
                                    </ul>

                                    <h2 className="pt-2">Testnet</h2>
                                    <ul className="list-disc">
                                        <li>address start with <span className="bg-gray-900 text-blue-500">kQ</span>
                                        </li>
                                        <li>address start with <span className="bg-gray-900 text-blue-500">0Q</span>
                                        </li>
                                    </ul>
                                </p>
                                <Divider className="my-4"/>
                                <div>
                                    <div>Q: How to config your wallet to connect testnet?</div>
                                    <div>A: <Link underline="always"
                                                  href="https://answers.ton.org/question/1561527682871595008/how-do-you-change-ton-keeper-to-testnet">view
                                        answer</Link>
                                    </div>
                                </div>
                                <div>
                                    <div>Q: How to get Toncoin at testnet?</div>
                                    <div>A: <Link underline="always"
                                                  href="https://t.me/testgiver_ton_bot">
                                        Testgiver TON Bot</Link>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>

                                <Button color="primary" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/*    Modal*/}

        </div>


    );
}


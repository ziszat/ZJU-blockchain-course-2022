import {Button, Image} from 'antd';
//import {Header} from "../../asset";
import {UserOutlined} from "@ant-design/icons";
import {useEffect, useState} from 'react';
import {societyContract, myERC20Contract, web3} from "../../utils/contracts";
import './index.css';

const GanacheTestChainId = '6000' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'StudentSociety'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545' 

const SocietyPage = () => {

    const [account, setAccount] = useState('')
    const [accountBalance, setAccountBalance] = useState(0)
    const [ProposalCost, setProposalCost] = useState(0)
    const [VoteCost, setVoteCost] = useState(0)
    //const [totalAmount, setTotalAmount] = useState(0)
    const [counter, setProposalNumber] = useState(0)
    const [managerAccount, setManagerAccount] = useState('')
    const [index, setindex] = useState<undefined | string>(undefined)
    const [name, setName] = useState<undefined | string>(undefined)
    const [index_create, setCreate] = useState<undefined | string>(undefined)
    const [index_passed, setPass] = useState<undefined | string>(undefined)
    const [index_denied, setDeny] = useState<undefined | string>(undefined)
    const [_name, setNameFound] = useState<undefined | string>(undefined)
    const [isPassed, setIsPassed] = useState(undefined)
    const [pros, setPros] = useState('')
    const [isOut, setIsOut] = useState(undefined)
    const [award, setAward] = useState(0)

    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if(accounts && accounts.length) {
                    setAccount(accounts[0])
                }
            }
        }

        initCheckAccounts()
    }, [])

    useEffect(() => {
        const getSocietyContractInfo = async () => {
            if (societyContract) {
                const ma = await societyContract.methods.manager().call()
                setManagerAccount(ma)
                const pn = await societyContract.methods.getProposalNumber().call()
                setProposalNumber(pn)
                const pa = await societyContract.methods.ProposalCost().call()
                setProposalCost(pa)
                const va = await societyContract.methods.VoteCost().call()
                setVoteCost(va)
            } else {
                alert('Contract not exists.')
            }
        }

        getSocietyContractInfo()
    }, [account])

    useEffect(() => {
        const getAccountInfo = async () => {
            if (myERC20Contract) {
                const ab = await myERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
            } else {
                alert('Contract not exists.')
            }
        }

        if(account !== '') {
            getAccountInfo()
        }
    }, [account])

    const onClaimTokenAirdrop = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (myERC20Contract) {
            try {
                await myERC20Contract.methods.airdrop().send({
                    from: account
                })
                alert('You have already got the tokens.')
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    const onAward = async () => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (societyContract && myERC20Contract) {
            if (award === 0) {
                alert('You do not have any award yet.')
            }
            else {
                try {
                    await societyContract.methods.award().send({
                        from: account
                    })

                    alert('You have received all your awards.')
                } catch (error: any) {
                    alert(error.message)
                }
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const onDisplay = async () => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (societyContract && myERC20Contract) {
            try {
                const _name = await societyContract.methods.getProposalName(index).call()
                setNameFound(_name)
                const isPassed = await societyContract.methods.isPassed(index).call()
                setIsPassed(isPassed)
                const pros = await societyContract.methods.getProposer(index).call()
                setPros(pros)
                const isOut = await societyContract.methods.isOutOfDue(index).call()
                setIsOut(isOut)
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const onPass = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (societyContract && myERC20Contract) {
            try {
                await myERC20Contract.methods.approve(societyContract.options.address, VoteCost).send({
                    from: account
                })

                await societyContract.methods.vote(index, true).send({
                    from: account
                })

                const aw = await societyContract.methods.getAward(account).call()
                setAward(aw)

                alert('You have voted.')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const onDeny = async () => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (societyContract && myERC20Contract) {
            try {
                await myERC20Contract.methods.approve(societyContract.options.address, VoteCost).send({
                    from: account
                })

                await societyContract.methods.vote(index, false).send({
                    from: account
                })

                const aw = await societyContract.methods.getAward(account).call()
                setAward(aw)

                alert('You have voted.')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const onPropose = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        } 

        if (societyContract && myERC20Contract) {
            try {
                await myERC20Contract.methods.approve(societyContract.options.address, ProposalCost).send({
                    from: account
                })
                const _index = await societyContract.methods.propose(name).send({
                    from: account
                })

                setCreate(_index)

                const pn = await societyContract.methods.getProposalNumber().call()
                setProposalNumber(pn)
                alert('You have submitted your proposal.')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const onClickConnectWallet = async () => {
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        // @ts-ignore
        const {ethereum} = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }

        try {
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            if (ethereum.chainId !== GanacheTestChainId) {
                const chain = {
                    chainId: GanacheTestChainId, // Chain-ID
                    chainName: GanacheTestChainName, // Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code === 4902) {
                        await ethereum.request({ method: 'wallet_addEthereumChain', params: [chain]
                        });
                    }
                }
            }

            // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
            await ethereum.request({method: 'eth_requestAccounts'});
            // 获取小狐狸拿到的授权用户列表
            const accounts = await ethereum.request({method: 'eth_accounts'});
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
        } catch (error: any) {
            alert(error.message)
        }
    }

    return (
        <div className='container'>
            <div className='main'>
                <h1>浙大社团组织治理网站</h1>
                <Button onClick={onClaimTokenAirdrop}>领取积分</Button>
                <div>管理员地址：{managerAccount}</div>
                <div className='account'>
                    {account === '' && <Button onClick={onClickConnectWallet}>连接钱包</Button>}
                    <div>当前用户：{account === '' ? '无用户连接' : account}</div>
                    <div>当前用户拥有积分数量：{account === '' ? 0 : accountBalance}</div>
                    <div>当前可领取奖励：{award}</div><Button onClick={onAward}>领取奖励</Button>
                </div>
                <div>花费{ProposalCost}积分，提交你的提案！每个人可以提交多个提案！</div>
                <div>
                    已有{counter}份提案提交
                </div>
                <div>
                    花费{VoteCost}积分，提交你对某个提案的表决，可以通过也可以反对！
                </div>
                <div className='operation'>
                    <div style={{marginBottom: '5px'}}>操作栏</div>
                    <div className='buttons'>
                        <div>
                            <div>提案号: </div>
                            <input onChange={(e) => setindex(e.target.value)} />
                        </div>
                        <Button style={{ width: '200px' }} onClick={onDisplay}>查看提案</Button>
                        <div>提案名称：{_name} </div>
                        <div>提案人：{pros} </div>
                        <div>    {isPassed === true && <div>提案状态：已通过</div>} </div>
                        <div>    {isOut === true && <div>提案截止情况：截止</div>} </div>
                        <div>    {isOut === false && <div>提案截止情况：投票中</div>} </div>
                        <Button style={{width: '200px'}} onClick={onPass}>同意</Button>
                        <Button style={{ width: '200px' }} onClick={onDeny}>否决</Button>
                        <div>
                            <div>提案名称： </div>
                                <input onChange={(e) => setName(e.target.value)} />
                        </div>
                        <Button style={{ width: '200px' }} onClick={onPropose}>提交提案</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SocietyPage
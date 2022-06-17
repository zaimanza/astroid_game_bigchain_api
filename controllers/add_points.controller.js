var router = require('express').Router()
const useLocalStorage = require('../modules/useLocalStorage')
const usePlayer = require('../modules/usePlayer')
const useCollection = require('../modules/useCollection')
const useMetadata = require('../modules/useMetadata')
const useBigchaindb = require('../modules/useBigchaindb')
const user_wallet = require('../utils/user_wallet.json')

const { removeItem } = useLocalStorage()
const { getCollection, createCollection } = useCollection()
const { getMetadatas, createMetadata } = useMetadata()
const { player_login, player_logout, player_register, getPlayer } = usePlayer()
const { fetchLatestTransaction, updateSingleAsset } = useBigchaindb()
// api/products
router.post('/add_points', async (req, res) => {
    try {
        const props = req.body;
        if (!props?.transaction_id || !props?.points) {
            res.status(400).json("Unauthorized")
            return
        }

        var isCanAppend = true

        var fetchedLatestTransaction = await fetchLatestTransaction(props?.transaction_id)

        if (!fetchedLatestTransaction) {
            isCanAppend = false
            res.status(400).json("Transaction does not exist")
            return
        }

        var updateMetadata = fetchedLatestTransaction.metadata
        if (updateMetadata?.points) {
            updateMetadata.points = updateMetadata.points + props?.points
        } else {
            updateMetadata.points = props?.points
        }

        var assetAppend = {}

        if (isCanAppend) {
            assetAppend = await updateSingleAsset({
                txCreatedID: fetchedLatestTransaction.id,
                metadata: updateMetadata,
                publicKey: user_wallet.publicKey,
                privateKey: user_wallet.privateKey,
            })
        }

        res.status(200).json(assetAppend)
    } catch (error) {
        res.status(400).json("error")
    }
})

module.exports = router;



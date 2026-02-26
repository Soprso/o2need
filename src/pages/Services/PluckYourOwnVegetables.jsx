import GardeningServicePage from '../../components/GardeningServicePage'
import { gardeningServices } from '../../data/gardeningServices'
const service = gardeningServices.find(s => s.id === 'pluck-your-own-vegetables')
const PluckYourOwnVegetables = () => <GardeningServicePage service={service} />
export default PluckYourOwnVegetables

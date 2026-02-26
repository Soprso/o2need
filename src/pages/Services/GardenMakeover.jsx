import GardeningServicePage from '../../components/GardeningServicePage'
import { gardeningServices } from '../../data/gardeningServices'
const service = gardeningServices.find(s => s.id === 'garden-makeover')
const GardenMakeover = () => <GardeningServicePage service={service} />
export default GardenMakeover

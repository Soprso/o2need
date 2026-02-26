import GardeningServicePage from '../../components/GardeningServicePage'
import { gardeningServices } from '../../data/gardeningServices'
const service = gardeningServices.find(s => s.id === 'setup-new-garden')
const SetupNewGarden = () => <GardeningServicePage service={service} />
export default SetupNewGarden

import GardeningServicePage from '../../components/GardeningServicePage'
import { gardeningServices } from '../../data/gardeningServices'
const service = gardeningServices.find(s => s.id === 'maintain-existing-garden')
const MaintainExistingGarden = () => <GardeningServicePage service={service} isMaintain={true} />
export default MaintainExistingGarden

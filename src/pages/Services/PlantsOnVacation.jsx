import GardeningServicePage from '../../components/GardeningServicePage'
import { gardeningServices } from '../../data/gardeningServices'
const service = gardeningServices.find(s => s.id === 'plants-on-vacation')
const PlantsOnVacation = () => <GardeningServicePage service={service} />
export default PlantsOnVacation

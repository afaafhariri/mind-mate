import { Loading } from "../components/Loading";

export const Splash = () => {
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500">
        <Loading />
    </div>)
}
;
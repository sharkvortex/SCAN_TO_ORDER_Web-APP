import PosHeader from "../../components/Admin/Pos/PosHeader";
import BtnTurnOnNotify from "../../components/Admin/Pos/BtnTurnOnNotify";
import PosTable from "../../components/Admin/Pos/PosTable";
import CallEmployeNotify from "../../components/Admin/Pos/CallEmployeNotify";
function Admin() {
  return (
    <main className="min-h-screen p-4">
      <PosHeader />
      <BtnTurnOnNotify />
      <CallEmployeNotify />
      <PosTable />
    </main>
  );
}

export default Admin;

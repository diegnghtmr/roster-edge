import { InternalHeader } from "@/components/layout/InternalHeader";
import { Plus } from "lucide-react";
import { EventsList } from "./components/List";

export const EventsModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Eventos"
        description="Administra los eventos deportivos"
        buttonText="Nuevo Evento"
        buttonIcon={<Plus className="h-4 w-4" />}
        buttonLink="/events-create"
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <EventsList />
      </div>
    </div>
  );
};

export default EventsModule;

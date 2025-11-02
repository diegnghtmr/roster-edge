import { PDFDocument, PDFTable, PDFSection, PDFStatCards, PDFBarChart } from "./PDFDocument";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { REPORT_COLORS, PDF_TYPOGRAPHY, PDF_SPACING, PDF_RADIUS } from "@/constants/reportColors";
import type { TeamRosterProfileResponse } from "@/interface/IReports";

const styles = StyleSheet.create({
  statBox: {
    flexDirection: "row",
    marginBottom: PDF_SPACING.sm,
    padding: PDF_SPACING.sm,
    backgroundColor: REPORT_COLORS.pdf.sectionBg,
    borderRadius: PDF_RADIUS.sm,
    borderLeft: `2 solid ${REPORT_COLORS.pdf.cardBorder}`,
  },
  statLabel: {
    fontSize: PDF_TYPOGRAPHY.fontSize.small,
    color: REPORT_COLORS.neutral.gray600,
    flex: 1,
  },
  statValue: {
    fontSize: PDF_TYPOGRAPHY.fontSize.small,
    fontWeight: PDF_TYPOGRAPHY.fontWeight.bold,
    fontFamily: PDF_TYPOGRAPHY.fontFamily.bold,
    color: REPORT_COLORS.primary.main,
  },
  sectionHeader: {
    fontSize: PDF_TYPOGRAPHY.fontSize.body,
    fontWeight: PDF_TYPOGRAPHY.fontWeight.bold,
    fontFamily: PDF_TYPOGRAPHY.fontFamily.bold,
    marginTop: PDF_SPACING.sm,
    marginBottom: PDF_SPACING.xs,
    color: REPORT_COLORS.neutral.gray800,
  },
});

interface RosterProfilePDFProps {
  data: TeamRosterProfileResponse[];
}

export const RosterProfilePDF = ({ data }: RosterProfilePDFProps) => {
  // Calculate overall stats
  const totalPlayers = data.reduce((sum, team) => sum + (team.totalPlayers || 0), 0);
  const totalActive = data.reduce((sum, team) => sum + (team.activePlayers || 0), 0);
  const avgAge = data.length > 0
    ? (data.reduce((sum, team) => sum + (team.averageAge || 0), 0) / data.length).toFixed(1)
    : "0";

  const overallStats = [
    { label: "Total de Jugadores", value: totalPlayers },
    { label: "Jugadores Activos", value: totalActive },
    { label: "Edad Promedio", value: `${avgAge} años` },
  ];

  // Chart data for players by team
  const chartData = data.slice(0, 10).map(team => ({
    name: (team.teamName || "Sin nombre").substring(0, 12),
    value: team.totalPlayers || 0,
  }));

  // Aggregate physical states
  const physicalStatesMap = new Map<string, number>();
  data.forEach((team) => {
    team.physicalStates?.forEach((state) => {
      const current = physicalStatesMap.get(state.physicalStateName || "Desconocido") || 0;
      physicalStatesMap.set(state.physicalStateName || "Desconocido", current + (state.players || 0));
    });
  });

  const physicalStatesData = Array.from(physicalStatesMap.entries())
    .map(([name, count]) => ({
      name: name.substring(0, 15),
      value: count,
    }))
    .slice(0, 10);

  return (
    <PDFDocument
      title="Perfil de Plantilla"
      subtitle="Análisis detallado de jugadores por equipo"
    >
      <PDFSection title="Resumen General">
        <PDFStatCards stats={overallStats} />
      </PDFSection>

      <PDFSection title="Jugadores por Equipo (Top 10)">
        <PDFBarChart data={chartData} height={180} />
      </PDFSection>

      {physicalStatesData.length > 0 && (
        <PDFSection title="Distribución por Estado Físico">
          <PDFBarChart data={physicalStatesData} height={160} />
        </PDFSection>
      )}

      {data.map((team, index) => (
        <PDFSection key={index} title={`${team.teamName} - ${team.clubName}`}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total de Jugadores:</Text>
            <Text style={styles.statValue}>{team.totalPlayers || 0}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Jugadores Activos:</Text>
            <Text style={styles.statValue}>{team.activePlayers || 0}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Edad Promedio:</Text>
            <Text style={styles.statValue}>
              {team.averageAge ? team.averageAge.toFixed(1) : "-"} años
            </Text>
          </View>

          {team.physicalStates && team.physicalStates.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>
                Estado Físico
              </Text>
              <PDFTable
                headers={["Estado", "Jugadores"]}
                data={team.physicalStates.map((state) => [
                  state.physicalStateName || "-",
                  state.players || 0,
                ])}
              />
            </>
          )}
        </PDFSection>
      ))}
    </PDFDocument>
  );
};

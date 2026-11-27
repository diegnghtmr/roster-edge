package co.edu.uniquindio.rosteredge.backend.service.report;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.HeaderFooter;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Locale;
import java.util.function.Consumer;

/** Shared, paginated PDF layout; the templates supply only scoped data and labels. */
final class ReportPdfLayout {
    private static final Color INK = new Color(30, 41, 59);
    private static final Color BRAND = new Color(153, 27, 27);
    private static final Color STRIPE = new Color(241, 245, 249);
    private static final BaseFont FONT = loadFont();
    private static final ZoneId CLUB_TIME = ZoneId.of("America/Bogota");
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("d 'de' MMMM 'de' uuuu",
            Locale.forLanguageTag("es-CO"));
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("HH:mm");

    private final Document document;

    private ReportPdfLayout(Document document) {
        this.document = document;
    }

    static byte[] render(String title, String subtitle, Consumer<ReportPdfLayout> sections) {
        return render(PageSize.A4, title, subtitle, sections);
    }

    static byte[] landscape(String title, String subtitle, Consumer<ReportPdfLayout> sections) {
        return render(PageSize.A4.rotate(), title, subtitle, sections);
    }

    private static byte[] render(Rectangle page, String title, String subtitle, Consumer<ReportPdfLayout> sections) {
        var now = ZonedDateTime.now(CLUB_TIME);
        String date = now.format(DATE);
        var bytes = new ByteArrayOutputStream();
        var document = new Document(page, 38, 38, 38, 42);
        PdfWriter.getInstance(document, bytes);
        document.addTitle(title);
        document.addCreator("RosterEdge");
        var footer = new HeaderFooter(new Phrase("RosterEdge - Sistema de Gestión Deportiva | " + date, font(9, false, INK)), false);
        footer.setBorder(Rectangle.TOP);
        footer.setAlignment(Element.ALIGN_CENTER);
        document.setFooter(footer);
        document.open();
        try {
            document.add(new Paragraph(title, font(23, true, BRAND)));
            document.add(new Paragraph(subtitle, font(12, false, INK)));
            var generated = new Paragraph("Generado el " + date + " a las " + now.format(TIME), font(9, false, INK));
            generated.setSpacingAfter(14);
            document.add(generated);
            sections.accept(new ReportPdfLayout(document));
        } finally {
            document.close();
        }
        return bytes.toByteArray();
    }

    void summary(Object[]... rows) {
        table("Resumen General", columns("Indicador", "Valor"), Arrays.asList(rows));
    }

    void note(String text) {
        document.add(new Paragraph(text, font(10, false, INK)));
    }

    void table(String title, String[] headers, Iterable<Object[]> rows) {
        table(title, headers, rows, null);
    }

    void table(String title, String[] headers, Iterable<Object[]> rows, ReportPdfChart chart) {
        if (chart != null) {
            addChart(title, chart);
        }
        float[] widths = new float[headers.length];
        Arrays.fill(widths, 1);
        if (widths.length > 2) {
            widths[0] = 1.8f;
        }
        var table = new PdfPTable(widths);
        table.setWidthPercentage(100);
        table.setSpacingBefore(chart == null ? 10 : 0);
        table.setSpacingAfter(4);
        table.setSplitLate(false);
        if (chart == null) {
            var section = cell(title, font(12, true, BRAND), Color.WHITE);
            section.setColspan(headers.length);
            table.addCell(section);
        }
        for (String header : headers) {
            table.addCell(cell(header, font(9, true, Color.WHITE), INK));
        }
        table.setHeaderRows(chart == null ? 2 : 1);
        int row = 0;
        for (Object[] values : rows) {
            if (values.length != headers.length) {
                throw new IllegalArgumentException("PDF table row does not match headers: " + title);
            }
            Color background = row++ % 2 == 0 ? STRIPE : Color.WHITE;
            for (Object value : values) {
                var cell = cell(value == null || "".equals(value) ? "-" : value.toString(), font(9, false, INK), background);
                if (value instanceof Number) {
                    cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                }
                table.addCell(cell);
            }
        }
        if (row == 0) {
            var empty = cell("Sin datos", font(9, false, INK), STRIPE);
            empty.setColspan(headers.length);
            table.addCell(empty);
        }
        document.add(table);
    }

    private void addChart(String title, ReportPdfChart chart) {
        // Keep the chart and its title on the same page without repeating the plot in table headers.
        var block = new PdfPTable(1);
        block.setWidthPercentage(100);
        block.setSpacingBefore(10);
        block.setKeepTogether(true);
        block.addCell(cell(title, font(12, true, BRAND), Color.WHITE));
        var plot = new PdfPCell();
        plot.setBorder(Rectangle.NO_BORDER);
        plot.setFixedHeight(chart.height());
        plot.setCellEvent((cell, box, layers) -> {
            var canvas = layers[PdfPTable.TEXTCANVAS];
            canvas.saveState();
            try {
                chart.drawing().paint(canvas, box, FONT);
            } finally {
                canvas.restoreState();
            }
        });
        block.addCell(plot);
        document.add(block);
    }

    static String[] columns(String... labels) {
        return labels;
    }

    static Object[] row(Object... values) {
        return values;
    }

    private static PdfPCell cell(String text, Font font, Color background) {
        var cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(5);
        cell.setBackgroundColor(background);
        return cell;
    }

    private static Font font(float size, boolean bold, Color color) {
        return new Font(FONT, size, bold ? Font.BOLD : Font.NORMAL, color);
    }

    private static BaseFont loadFont() {
        // Use the Liberation Sans bundled with OpenPDF, not a host font or a remote asset.
        var resource = "/font-fallback/LiberationSans-Regular.ttf";
        try (var stream = ReportPdfLayout.class.getResourceAsStream(resource)) {
            if (stream == null) {
                throw new IllegalStateException("Missing PDF font: " + resource);
            }
            return BaseFont.createFont("LiberationSans-Regular.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED,
                    true, stream.readAllBytes(), null);
        } catch (IOException e) {
            throw new UncheckedIOException("Could not load the report font", e);
        }
    }
}

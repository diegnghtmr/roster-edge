package co.edu.uniquindio.rosteredge.backend.service.report;

import com.lowagie.text.Element;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfContentByte;

import java.awt.Color;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.DoubleStream;

/** Vector plots in a reserved, page-relative rectangle. No external chart or font assets. */
record ReportPdfChart(float height, ReportPdfChart.Drawing drawing) {
    static final Color RED = new Color(0xdc2626);
    static final Color BLUE = new Color(0x3b82f6);
    static final Color GREEN = new Color(0x10b981);
    static final Color ORANGE = new Color(0xf97316);
    private static final Color BAR_FILL = new Color(0xef4444);
    private static final Color BAR_OUTLINE = new Color(0xb91c1c);
    private static final Color GRID = new Color(0xe5e7eb);
    private static final Color AXIS = new Color(0x9ca3af);
    private static final Color LABEL = new Color(0x374151);
    private static final List<Color> SLICES = List.of(BLUE, GREEN, ORANGE, new Color(0xa855f7),
            new Color(0x06b6d4), new Color(0xec4899), new Color(0x6366f1), new Color(0xeab308));

    record Sample(String label, double... values) { }

    record Series(String label, Color color) { }

    @FunctionalInterface
    interface Drawing {
        void paint(PdfContentByte canvas, Rectangle box, BaseFont font);
    }

    static ReportPdfChart bars(float height, List<Sample> samples, Series... series) {
        if (samples.isEmpty()) {
            return null;
        }
        return new ReportPdfChart(height, (canvas, box, font) -> {
            boolean grouped = series.length > 0;
            if (grouped) {
                legend(canvas, box, font, series);
            }
            var plot = new Rectangle(box.getLeft() + 10, box.getBottom() + 29,
                    box.getRight() - 10, box.getTop() - (grouped ? 37 : 23));
            double min = Math.min(0, values(samples).min().orElse(0));
            double max = Math.max(0, values(samples).max().orElse(0));
            if (min == max) {
                max = 1; // A nonempty report can still contain only zeros.
            }
            float baseline = y(plot, 0, min, max);
            grid(canvas, plot, 4);
            float groupWidth = plot.getWidth() / samples.size();
            for (int i = 0; i < samples.size(); i++) {
                var sample = samples.get(i);
                float center = plot.getLeft() + (i + 0.5f) * groupWidth;
                float barWidth = groupWidth * 0.7f / sample.values().length;
                float barLeft = center - groupWidth * 0.35f;
                for (int j = 0; j < sample.values().length; j++) {
                    double value = sample.values()[j];
                    float tip = y(plot, value, min, max);
                    Color fill = grouped ? series[j].color() : BAR_FILL;
                    canvas.setColorFill(fill);
                    canvas.setColorStroke(grouped ? fill : BAR_OUTLINE);
                    canvas.setLineWidth(0.6f);
                    canvas.rectangle(barLeft, Math.min(baseline, tip), barWidth, Math.abs(tip - baseline));
                    canvas.fillStroke();
                    if (!grouped || Math.abs(tip - baseline) > 15) {
                        String number = BigDecimal.valueOf(value).stripTrailingZeros().toPlainString();
                        label(canvas, font, fit(font, number, 8, barWidth + 2), 8, Element.ALIGN_CENTER,
                                barLeft + barWidth / 2, tip + (value < 0 ? -10 : 5));
                    }
                    barLeft += barWidth;
                }
                label(canvas, font, fit(font, shorten(sample.label(), grouped ? 8 : 10), 8, groupWidth - 3),
                        8, Element.ALIGN_CENTER, center, box.getBottom() + 7);
            }
            canvas.setColorStroke(AXIS);
            canvas.setLineWidth(1);
            segment(canvas, plot.getLeft(), baseline, plot.getRight(), baseline);
        });
    }

    static ReportPdfChart lines(float height, List<Sample> samples, String xCaption, Series... series) {
        if (samples.isEmpty()) {
            return null;
        }
        return new ReportPdfChart(height, (canvas, box, font) -> {
            if (xCaption == null) {
                legend(canvas, box, font, series);
            }
            var plot = new Rectangle(box.getLeft() + 42, box.getBottom() + 31,
                    box.getRight() - 31, box.getTop() - (xCaption == null ? 37 : 16));
            // Round the scale up to a multiple of the five grid steps so every
            // axis label is an exact whole number and points sit on their values.
            double max = Math.max(5, Math.ceil(values(samples).max().orElse(0) / 5) * 5);
            grid(canvas, plot, 5);
            for (int i = 0; i <= 5; i++) {
                label(canvas, font, Long.toString(Math.round(max * i / 5)), 9, Element.ALIGN_RIGHT,
                        plot.getLeft() - 6, plot.getBottom() + plot.getHeight() * i / 5 - 3);
            }
            canvas.setColorStroke(AXIS);
            canvas.setLineWidth(1);
            canvas.moveTo(plot.getLeft(), plot.getTop());
            canvas.lineTo(plot.getLeft(), plot.getBottom());
            canvas.lineTo(plot.getRight(), plot.getBottom());
            canvas.stroke();

            float step = plot.getWidth() / Math.max(samples.size() - 1, 1);
            for (int j = 0; j < series.length; j++) {
                Color color = series[j].color();
                canvas.setColorStroke(color);
                canvas.setLineWidth(2.5f);
                canvas.moveTo(plot.getLeft(), y(plot, samples.getFirst().values()[j], 0, max));
                for (int i = 1; i < samples.size(); i++) {
                    canvas.lineTo(plot.getLeft() + step * i, y(plot, samples.get(i).values()[j], 0, max));
                }
                canvas.stroke();
                canvas.setColorFill(color);
                canvas.setColorStroke(Color.WHITE);
                canvas.setLineWidth(1);
                for (int i = 0; i < samples.size(); i++) {
                    canvas.circle(plot.getLeft() + step * i, y(plot, samples.get(i).values()[j], 0, max), 3.5f);
                    canvas.fillStroke();
                }
            }
            if (xCaption != null) {
                label(canvas, font, xCaption, 10, Element.ALIGN_CENTER,
                        (plot.getLeft() + plot.getRight()) / 2, box.getBottom() + 8);
            } else {
                int interval = (int) Math.ceil(samples.size() / 8.0);
                int last = samples.size() - 1;
                for (int i = 0; i <= last; i++) {
                    if (i == last || (i % interval == 0 && step * (last - i) >= 45)) {
                        label(canvas, font, shortenDate(samples.get(i).label()), 8, Element.ALIGN_CENTER,
                                plot.getLeft() + step * i, plot.getBottom() - 15);
                    }
                }
            }
        });
    }

    static ReportPdfChart pie(float height, List<Sample> samples) {
        double total = values(samples).sum();
        if (total <= 0) {
            return null;
        }
        return new ReportPdfChart(height, (canvas, box, font) -> {
            float radius = Math.min(box.getHeight() / 2 - 10, 68);
            float cx = box.getLeft() + radius + 14;
            float cy = (box.getTop() + box.getBottom()) / 2;
            double start = 90;
            int i = 0;
            canvas.setColorStroke(Color.WHITE);
            canvas.setLineWidth(1);
            for (var sample : samples) {
                double extent = -360 * sample.values()[0] / total;
                canvas.setColorFill(SLICES.get(i++ % SLICES.size()));
                if (extent == 0) {
                    continue;
                }
                // arc() starts a new subpath. Append its Béziers to the radial path instead.
                var arc = PdfContentByte.bezierArc(cx - radius, cy - radius, cx + radius, cy + radius, (float) start, (float) extent);
                canvas.moveTo(cx, cy);
                canvas.lineTo(arc.getFirst()[0], arc.getFirst()[1]);
                for (var curve : arc) {
                    canvas.curveTo(curve[2], curve[3], curve[4], curve[5], curve[6], curve[7]);
                }
                canvas.closePath();
                canvas.fillStroke();
                start += extent;
            }
            float legendLeft = cx + radius + 19;
            int rows = Math.max(1, (int) ((height - 16) / 14));
            int columns = (samples.size() + rows - 1) / rows;
            float columnWidth = (box.getRight() - legendLeft) / columns;
            for (i = 0; i < samples.size(); i++) {
                var sample = samples.get(i);
                float left = legendLeft + i / rows * columnWidth;
                float bottom = box.getTop() - 18 - (i % rows) * 14;
                canvas.setColorFill(SLICES.get(i % SLICES.size()));
                canvas.rectangle(left, bottom, 8, 8);
                canvas.fill();
                String share = String.format(Locale.ROOT, ": %.1f%%", sample.values()[0] * 100 / total);
                String name = fit(font, sample.label(), 9, columnWidth - 16 - font.getWidthPoint(share, 9));
                label(canvas, font, name + share, 9, Element.ALIGN_LEFT, left + 12, bottom);
            }
        });
    }

    private static DoubleStream values(List<Sample> samples) {
        return samples.stream().flatMapToDouble(sample -> Arrays.stream(sample.values()));
    }

    private static void grid(PdfContentByte canvas, Rectangle plot, int intervals) {
        canvas.setColorStroke(GRID);
        canvas.setLineWidth(0.5f);
        for (int i = 0; i <= intervals; i++) {
            float y = plot.getBottom() + plot.getHeight() * i / intervals;
            segment(canvas, plot.getLeft(), y, plot.getRight(), y);
        }
    }

    private static float y(Rectangle plot, double value, double min, double max) {
        return plot.getBottom() + (float) ((value - min) / (max - min)) * plot.getHeight();
    }

    private static void legend(PdfContentByte canvas, Rectangle box, BaseFont font, Series[] series) {
        float x = box.getLeft() + 10;
        float baseline = box.getTop() - 14;
        for (var entry : series) {
            canvas.setColorStroke(entry.color());
            canvas.setLineWidth(3);
            segment(canvas, x, baseline + 3, x + 14, baseline + 3);
            label(canvas, font, entry.label(), 9, Element.ALIGN_LEFT, x + 20, baseline);
            x += 36 + font.getWidthPoint(entry.label(), 9);
        }
    }

    private static String shortenDate(String text) {
        return text.codePointCount(0, text.length()) <= 10 ? text : shorten(text, 8);
    }

    private static String shorten(String text, int length) {
        return text.codePointCount(0, text.length()) <= length ? text : text.substring(0, text.offsetByCodePoints(0, length)) + "...";
    }

    private static String fit(BaseFont font, String text, float size, float width) {
        if (font.getWidthPoint(text, size) <= width) {
            return text;
        }
        for (int end = text.length(); end > 0; ) {
            end = text.offsetByCodePoints(end, -1);
            String shortened = text.substring(0, end) + "...";
            if (font.getWidthPoint(shortened, size) <= width) {
                return shortened;
            }
        }
        return "";
    }

    private static void label(PdfContentByte canvas, BaseFont font, String text, float size, int align, float x, float y) {
        canvas.beginText();
        canvas.setFontAndSize(font, size);
        canvas.setColorFill(LABEL);
        canvas.showTextAligned(align, text, x, y, 0);
        canvas.endText();
    }

    private static void segment(PdfContentByte canvas, float x1, float y1, float x2, float y2) {
        canvas.moveTo(x1, y1);
        canvas.lineTo(x2, y2);
        canvas.stroke();
    }
}

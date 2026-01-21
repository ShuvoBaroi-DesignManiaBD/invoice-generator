import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { InvoiceFormValues } from '@/lib/schemas';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flexDirection: 'column',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 5,
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
  },
  colDescription: { width: '50%' },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },
  bold: { fontWeight: 'bold', fontSize: 12 },
  text: { fontSize: 10, marginBottom: 2 },
  totalSection: { marginTop: 20, alignItems: 'flex-end' },
});

export const InvoiceDocument = ({ data }: { data: InvoiceFormValues }) => {
    const subtotal = data.items.reduce((acc, item) => acc + (Number(item.quantity || 0) * Number(item.price || 0)), 0);
    const taxRate = Number(data.taxRate || 0);
    const discount = Number(data.discount || 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount - discount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
            <Text style={styles.header}>INVOICE</Text>
            
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={[styles.bold, { marginBottom: 5 }]}>From:</Text>
                    <Text style={styles.text}>{data.fromName}</Text>
                    {data.fromAddress && <Text style={styles.text}>{data.fromAddress}</Text>}
                    {data.fromEmail && <Text style={styles.text}>Email: {data.fromEmail}</Text>}
                    {data.fromPhone && <Text style={styles.text}>Phone: {data.fromPhone}</Text>}
                    {data.fromVat && <Text style={styles.text}>VAT: {data.fromVat}</Text>}
                    {data.fromRegNumber && <Text style={styles.text}>Reg: {data.fromRegNumber}</Text>}
                </View>
                <View style={styles.column}>
                    <Text style={[styles.bold, { marginBottom: 5 }]}>To:</Text>
                    <Text style={styles.text}>{data.toName}</Text>
                    {data.toAddress && <Text style={styles.text}>{data.toAddress}</Text>}
                    {data.toEmail && <Text style={styles.text}>Email: {data.toEmail}</Text>}
                    {data.toPhone && <Text style={styles.text}>Phone: {data.toPhone}</Text>}
                    {data.toVat && <Text style={styles.text}>VAT: {data.toVat}</Text>}
                    {data.toRegNumber && <Text style={styles.text}>Reg: {data.toRegNumber}</Text>}
                </View>
            </View>

            <View style={[styles.row, { borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10 }]}>
                <View style={styles.column}>
                    <Text style={styles.text}>Invoice #: {data.invoiceNumber}</Text>
                    <Text style={styles.text}>Date: {format(data.date, "MMM d, yyyy")}</Text>
                    <Text style={styles.text}>Due Date: {format(data.dueDate, "MMM d, yyyy")}</Text>
                </View>
            </View>

            <View style={styles.tableHeader}>
                <Text style={[styles.colDescription, styles.bold]}>Description</Text>
                <Text style={[styles.colQty, styles.bold]}>Qty</Text>
                <Text style={[styles.colPrice, styles.bold]}>Price</Text>
                <Text style={[styles.colTotal, styles.bold]}>Total</Text>
            </View>
            
            {data.items.map((item, i) => (
                <View key={i} style={styles.tableRow}>
                    <Text style={[styles.colDescription, styles.text]}>{item.description}</Text>
                    <Text style={[styles.colQty, styles.text]}>{item.quantity}</Text>
                    <Text style={[styles.colPrice, styles.text]}>{Number(item.price || 0).toFixed(2)}</Text>
                    <Text style={[styles.colTotal, styles.text]}>{(Number(item.quantity || 0) * Number(item.price || 0)).toFixed(2)}</Text>
                </View>
            ))}

            <View style={styles.totalSection}>
                <Text style={styles.text}>Subtotal: {subtotal.toFixed(2)}</Text>
                <Text style={styles.text}>Tax ({taxRate}%): {taxAmount.toFixed(2)}</Text>
                <Text style={styles.text}>Discount: -{discount.toFixed(2)}</Text>
                <Text style={[styles.bold, { marginTop: 5, fontSize: 14 }]}>Total: {data.currency} {total.toFixed(2)}</Text>
            </View>
        </View>
      </Page>
    </Document>
  );
};

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface ConditionProps {
  onAccept: () => void;
}

export default function Condition({ onAccept }: ConditionProps) {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>
      <ScrollView
        style={styles.scrollView}
      >
        <Text style={styles.content}>
            La SGLN est une entreprise publique opérant dans les jeux de hasard à 
            travers plusieurs canaux ; dans son réseau de vente, par téléphone et 
            sur Internet.
            {'\n\n'}
            La SGLN est responsable de vos données, et s'attache à leur assurer 
            un haut niveau de protection. La SGLN s'engage à respecter la confiance 
            que vous lui accordez en se conformant aux règlementations en vigueur 
            concernant la protection de vos données personnelles.
            {'\n\n'}
            En tant que responsable du traitement de vos données, la SGLN définit 
            la manière dont vos données personnelles sont recueillies et les finalités
            de leur traitement. La SGLN suit les évolutions en la matière et pourra 
            être amenée à adapter ses services et systémes, et ainsi a faire évoluer
            cette politique de confidentialité. afin de conserver un standard élevé
            concernant la protection de vos données personnelles.
            {'\n\n'}
            La SGLN ne peut pas être considérée comme responsable :
            {'\n'}
            • De toute difficulté technique, que l'Utilisateur pourrait rencontrer 
            sur le Site, quelle qu'en soit la cause ou la manifestation, 
            telle que notamment, bogues, virus, dommages affectant le matériel 
            et/ou les logiciels de l'Utilisateur
            {'\n'}
            • De tout dommage direct ou indirect dû à un cas de force majeure ou à un 
            fait de tiers, tels que notamment, tout dommage pouvant résulter des 
            informations, opinions et recommandations présents sur d'autres sites et 
            dont l'accès est donné par des liens hypertextes présents sur le Site.
        </Text>
      </ScrollView>
      <TouchableOpacity
        style={[styles.acceptButton, { backgroundColor: colors.primaryBlue }]}
        onPress={onAccept}
      >
        <Text style={styles.acceptText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: colors.primaryBlue,
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  acceptButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

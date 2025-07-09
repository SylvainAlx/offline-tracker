import { Goal } from "@/constants/Goals";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";

type Props = {
  goal: Goal;
  totalSeconds: number;
};

export default function GoalProgress({ goal, totalSeconds }: Props) {
  const isAchieved = totalSeconds >= goal.targetSeconds;
  const percent = Math.min(1, totalSeconds / goal.targetSeconds);

  return (
    <View style={[styles.card, isAchieved ? styles.achieved : styles.pending]}>
      <Text style={styles.title}>
        {goal.label} {isAchieved ? "✅" : ""}
      </Text>

      {!isAchieved && (
        <>
          <Progress.Bar
            progress={percent}
            width={null}
            color="#4CAF50"
            height={12}
            borderRadius={10}
            unfilledColor="#eee"
            borderWidth={0}
            style={{ marginTop: 10 }}
          />
          <Text style={styles.percentText}>
            {(percent * 100).toFixed(0)}% complété
          </Text>
        </>
      )}

      {isAchieved && (
        <Text style={styles.achievedText}>🎉 Objectif atteint !</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
  },
  pending: {
    backgroundColor: "#f9f9f9",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  achieved: {
    backgroundColor: "#e0f7e9",
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  percentText: {
    marginTop: 6,
    fontSize: 14,
    color: "#888",
  },
  achievedText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#388e3c",
  },
});

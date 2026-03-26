export function extractChoiceArtifacts(choice, parsed = {}) {
  return {
    text: choice?.delta?.content ?? null,
    reasoning: choice?.delta?.reasoning ?? null,
    toolCalls: choice?.delta?.tool_calls ?? [],
    annotations:
      choice?.message?.annotations ||
      choice?.delta?.annotations ||
      parsed.annotations ||
      null,
    images:
      choice?.delta?.images ||
      choice?.message?.images ||
      parsed.images ||
      [],
    videos:
      choice?.delta?.videos ||
      choice?.message?.videos ||
      parsed.videos ||
      [],
  };
}

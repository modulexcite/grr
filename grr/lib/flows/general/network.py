#!/usr/bin/env python
"""These are network related flows."""


from grr.lib import flow


class Netstat(flow.GRRFlow):
  """List active network connections on a system."""

  category = "/Network/"
  behaviours = flow.GRRFlow.behaviours + "BASIC"

  @flow.StateHandler()
  def Start(self):
    """Start processing."""
    self.CallClient("Netstat", next_state="StoreNetstat")

  @flow.StateHandler()
  def StoreNetstat(self, responses):
    """Collects the connections.

    Args:
      responses: A list of rdf_client.NetworkConnection objects.

    Raises:
      flow.FlowError: On failure to get retrieve the connections.
    """
    if not responses.success:
      raise flow.FlowError("Failed to get connections. Err: {0}".format(
          responses.status))

    for response in responses:
      self.SendReply(response)

    self.state.conn_count = len(responses)

  @flow.StateHandler()
  def End(self):
    self.Log("Successfully wrote %d connections.", self.state.conn_count)
    self.Notify("ViewObject", self.client_id, "Listed Connections")

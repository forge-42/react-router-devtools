import type React from "react"
import type { RequestEvent } from "../../../shared/request-event"
import { cx } from "../../styles/use-styles"
import { useStyles } from "../../styles/use-styles"
import { METHOD_COLORS } from "../../tabs/TimelineTab"
import { Tag } from "../Tag"
import { Icon } from "../icon/Icon"
import { JsonRenderer } from "../jsonRenderer"

interface RequestDetailsProps {
	request: RequestEvent
	onClose: () => void
	onChangeRequest: (index: number) => void
	total: number
	index: null | number
}

export const RequestDetails: React.FC<RequestDetailsProps> = ({ request, onClose, total, index, onChangeRequest }) => {
	const { styles } = useStyles()

	if (index === null) {
		return
	}

	const typeBadgeColorClass =
		request.type === "loader"
			? styles.network.details.typeBadgeGreen
			: request.type === "client-loader"
				? styles.network.details.typeBadgeBlue
				: request.type === "action"
					? styles.network.details.typeBadgeYellow
					: request.type === "client-action"
						? styles.network.details.typeBadgePurple
						: styles.network.details.typeBadgeWhite

	return (
		<div className={styles.network.details.container}>
			<div className={styles.network.details.content}>
				<div className={styles.network.details.header}>
					<div className={styles.network.details.headerRow}>
						<div className={styles.network.details.tagsContainer}>
							{request?.method && (
								<Tag className="w-max" color={METHOD_COLORS[request.method]}>
									{request.method}
								</Tag>
							)}
							{request?.type && (
								<div className={cx(styles.network.details.typeBadge, typeBadgeColorClass)}>{request.type}</div>
							)}
							{request?.aborted && (
								<div className={cx(styles.network.details.typeBadge, styles.network.details.typeBadgeRed)}>
									Request aborted
								</div>
							)}
						</div>
						<div className={styles.network.details.controls}>
							<div className={styles.network.details.navButtons}>
								{index > 0 ? (
									<button
										type="button"
										onClick={() => onChangeRequest(index - 1)}
										className={cx(styles.network.details.navButton, styles.network.details.navButtonLeft)}
									>
										<Icon name="ChevronDown" />
									</button>
								) : null}
								{index < total - 1 ? (
									<button
										type="button"
										onClick={() => onChangeRequest(index + 1)}
										className={cx(styles.network.details.navButton, styles.network.details.navButtonRight)}
									>
										<Icon name="ChevronDown" />
									</button>
								) : null}
							</div>
							<button type="button" className={styles.network.details.closeButton} onClick={onClose}>
								<Icon name="X" />
							</button>
						</div>
					</div>
					{request.id} <span className={styles.network.details.title}>- {request.url}</span>
				</div>

				<div>
					Request duration: {new Date(request.startTime).toLocaleTimeString()}{" "}
					{request.endTime && `- ${new Date(request.endTime).toLocaleTimeString()} `}
					{request.endTime && (
						<span className={styles.network.details.duration}>
							({(request.endTime - request.startTime).toFixed(0)}ms)
						</span>
					)}
				</div>

				{request.data && (
					<div className={styles.network.details.section}>
						<div className={styles.network.details.sectionHeader}>Returned Data</div>
						<div className={styles.network.details.sectionContent}>
							<JsonRenderer data={request.data} />
						</div>
					</div>
				)}
				{request.headers && Object.keys(request.headers).length > 0 && (
					<div className={styles.network.details.section}>
						<div className={styles.network.details.sectionHeader}>Headers</div>
						<div className={styles.network.details.sectionContent}>
							<JsonRenderer data={request.headers} />
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
